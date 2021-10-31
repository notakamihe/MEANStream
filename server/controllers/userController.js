require("dotenv").config()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./../models/User")
const Comment = require("./../models/Comment")
const Song = require("./../models/Song")
const Collection = require("./../models/Collection")
const { uploadFile } = require("../s3")
const { getPopulatedSongs } = require("../utils/utils")

const getUserPopulated = (user, res) => {
    user.populate("followers").populate("following").execPopulate((err, doc) => {
        return res.json(doc)
    })
}

module.exports.addFollower = async (req, res) => {
    try {
        const follower = await User.findById(req.params.followerId)

        if (!follower)
            return res.status(400).send(`User w/ id of ${req.params.followerId} does not exist.`)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.followerId} does not exist.`)
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        if (!user.followers.includes(req.params.followerId))
            user.followers.push(req.params.followerId)

        await user.save()

        getUserPopulated(user, res)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    }
}

module.exports.addFollowing = async (req, res) => {
    try {
        const following = await User.findById(req.params.followingId)

        if (!following)
            return res.status(400).send(`User w/ id of ${req.params.followingId} does not exist.`)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.followingId} does not exist.`)
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        if (!user.following.includes(req.params.followingId))
            user.following.push(req.params.followingId)

        await user.save()

        getUserPopulated(user, res)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    }
}

module.exports.authenticateUser = async (req, res) => {
    try {
        const user = await User.findOne({$or: [
            {username: req.body.usernameOrEmail}, 
            {email: req.body.usernameOrEmail}
        ]})

        if (!user)
            return res.status(401).send(`User w/ username or email of ${req.body.usernameOrEmail || ""} does not exist.`)

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send("Incorrect password.")
        }

        const token = jwt.sign({id: user._id}, "secret", {expiresIn: 86400})
        res.send({token: token})
    } catch (err) {
        return res.status(500).send("Could not authenticate user.")
    }
}

module.exports.deleteUser = async (req, res) => {
    User.findByIdAndDelete(req.params.id, async (err, doc) => {
        if (err || !doc)
            return res.status(400).send(`Could not delete user w/ id of ${req.params.id}.`)

        try {
            await Song.deleteMany({user: doc._id})
            await Collection.deleteMany({user: doc._id})
            await Comment.deleteMany({user: doc._id})

            await User.updateMany({followers: doc._id}, {$pull: {followers: doc._id}})
            await User.updateMany({following: doc._id}, {$pull: {following: doc._id}})
            await Song.updateMany({likes: doc._id}, {$pull: {likes: doc._id}})
            await Comment.updateMany({likes: doc._id}, {$pull: {likes: doc._id}})
        } catch (err) {
            if (err)
                console.log(err);
        }

        return res.send("User deleted.")
    })
}

module.exports.getAllUsers = async (req, res) => {
    res.json(await User.find())
}

module.exports.getLiked = async (req, res) => {
    User.findById(req.params.id, async (err, doc) => {
      if (err) {
          console.log(err);
          return res.status(500).send("Could not get user.")
      }

      if (!doc)
          return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

      Song.find({likes: doc._id}).populate("user").exec(async (e, songs) => {
          if (e) {
              console.log(e);
              return res.status(500).send("Could not get liked songs.")
          }

          Comment.find({likes: doc._id}).populate("user").exec(async (e, comments) => {
            if (e) {
              console.log(e);
              return res.status(500).send("Could not get liked comments.")
            }
            
            return res.json({songs, comments})
          })
      })
    })
}

module.exports.getUserById = async (req, res) => {
    User.findById(req.params.id).then(result => {
        if (!result)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        getUserPopulated(result, res)
    }).catch(err => {
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    })
}

module.exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})

        if (!user)
            return res.status(400).send(`User w/ username of ${req.params.username} does not exist.`)

        getUserPopulated(user, res)
    } catch (err) {
        return res.send("Could not get user by username.")
    }
}

module.exports.getUserByToken = async (req, res) => {
    var token = req.headers["x-access-token"]

    if (!token)
        return res.status(401).send("No token provided")

    jwt.verify(token, "secret", async (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.")

        try {
            const user = await User.findById(decoded.id)
            return getUserPopulated(user, res)
        } catch (err) {
            return res.status(500).send("Failed to retreive user.")
        }
    })
}

module.exports.privateAll = async (req, res) => {
    User.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get user.")
        }

        if (!doc)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        const songs = await Song.updateMany({user: req.params.id}, {private: true})
        const collections = await Collection.updateMany({user: req.params.id}, {private: true})

        return res.json({songs, collections})
    })
}

module.exports.registerUser = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).send("Must provide password.")
    } else if (req.body.password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters.")
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    
    const user = new User({
        description: req.body.description,
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username
    })

    try {
        const result = await user.save()
        const token = jwt.sign({id: result._id}, "secret", {expiresIn: 86400})

        return res.status(201).send({token: token})
    } catch (err) {
        if (err.keyPattern) {
            if (err.keyPattern.email)
                return res.status(400).send("Email taken.")

            if (err.keyPattern.username)
                return res.status(400).send("Username taken.")
        }

        for (const key of Object.keys(err.errors)) {
            return res.status(400).send(err.errors[key].message)
        }
    }
}

module.exports.removeAllLikesComments = async (req, res) => {
    User.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get user.")
        }

        if (!doc)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        await Comment.deleteMany({user: doc._id})

        await Song.updateMany({likes: doc._id}, {$pull: {likes: doc._id}})
        await Comment.updateMany({likes: doc._id}, {$pull: {likes: doc._id}})

        return res.json({message: "Removed all likes and comments."})
    })
}

module.exports.removeFollower = async (req, res) => {
    try {
        const follower = await User.findById(req.params.followerId)

        if (!follower)
            return res.status(400).send(`User w/ id of ${req.params.followerId} does not exist.`)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.followerId} does not exist.`)
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        user.followers = user.followers.filter(f => f != req.params.followerId)
        await user.save()

        getUserPopulated(user, res)
    } catch (err) {
        console.log(err);
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    }
}

module.exports.removeFollowing = async (req, res) => {
    try {
        const following = await User.findById(req.params.followingId)

        if (!following)
            return res.status(400).send(`User w/ id of ${req.params.followingId} does not exist.`)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.followingId} does not exist.`)
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user)
            return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        user.following = user.following.filter(f => f != req.params.followingId)
        await user.save()

        getUserPopulated(user, res)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    }
}

module.exports.updateUser = async (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
        email: req.body.email,
        username: req.body.username
    }, {new: true, runValidators: true}, (err, docs) => {
        if (err) {
            if (err.keyPattern) {
                if (err.keyPattern.email)
                    return res.status(400).send("Email taken.")
    
                if (err.keyPattern.username)
                    return res.status(400).send("Username taken.")
            }

            if (err.errors) {
                return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
            }

            return res.status(400).send(`Could not update user w/ id of ${req.params.id}.`)   
        }

        if (!docs)
            return res.status(400).send(`Could not update user w/ id of ${req.params.id}.`)
            
        getUserPopulated(docs, res)
    })
}

module.exports.updateUserPfp = async (req, res) => {
    User.findById(req.params.id).then(async result => {
        if (!result)
            res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        const file = req.file

        if (file) {
          await uploadFile(file)
        }

        result.pfpUrl = file?.path

        const updatedResult = await result.save()
        getUserPopulated(updatedResult, res)
    }).catch(err => {
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    })
}

module.exports.updateUserPassword = async (req, res) => {
    User.findById(req.params.id).then(async result => {
        if (!result)
            res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

        if (!req.body.password)
            return res.status(400).send("Password must not be blank.")
        else if (req.body.password.length < 8)
            return res.status(400).send("Password must be at least 8 characters.")

        const hashedPassword = bcrypt.hashSync(req.body.password, 8)

        result.password = hashedPassword

        const updatedResult = await result.save()
        getUserPopulated(updatedResult, res)
    }).catch(err => {
        console.log(err);
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)
    })
}