const moment = require("moment")

const Collection = require("./../models/Collection")
const Comment = require("./../models/Comment")
const Song = require("./../models/Song")
const User = require("./../models/User")

const {uploadFile} = require("./../s3")

const utils = require("./../utils/utils")

const getPopulatedSong = (song, res) => {
    song.populate("user").populate("likes").populate({
        path: "comments",
        populate: [
            {
                path: "user",
                model: "User",
            },
            {
                path: "repliedTo",
                model: "Comment",
                populate: {
                    path: "user",
                    model: "User"
                }
            }
        ]
    }).execPopulate((err, doc) => {
        return res.json(doc)
    })
}

module.exports.addComment = async (req, res) => {
    if (!(await utils.isOIdInDatabase(User, req.body.user))) {
        return res.status(400).send(`User w/ id of ${req.body.user} does not exist.`)
    }

    if (req.body.repliedTo && !(await utils.isOIdInDatabase(Comment, req.body.repliedTo))) {
        return res.status(400).send(`Comment w/ id of ${req.body.repliedTo} does not exist.`)
    }

    const comment = new Comment({
        content: req.body.content,
        repliedTo: req.body.repliedTo,
        user: req.body.user
    })

    Song.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not add comment.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        try {
            const newComment = await comment.save()

            doc.comments.push(newComment._id)
            const updatedSong = await doc.save()
            getPopulatedSong(updatedSong, res)
        } catch (err) {
            if (err.errors)
                return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message)

            console.log(err);
            return res.status(500).send("Could not add comment.")
        }
    })
}

module.exports.addPlay = async (req, res) => {
    Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true }, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not remove comment.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        getPopulatedSong(doc, res)
    })
}

module.exports.createSong = async (req, res) => {
    try {
        const user = await User.findById(req.body.user)

        if (!user)
            return res.status(400).send(`User w/ id of ${req.body.user} does not exist.`)
    } catch (err) {
        return res.status(400).send(`User w/ id of ${req.body.user} does not exist.`)
    }

    const song = new Song({
        description: req.body.description,
        private: Boolean(req.body.private),
        title: req.body.title,
        user: req.body.user,
        releaseDate: req.body.releaseDate
    })

    try {
        const result = await song.save()
        getPopulatedSong(result, res)
    } catch (err) {
        if (err.errors) {
            return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message)
        }

        return res.status(400).send(err.message)
    }
}

module.exports.deleteSong = async (req, res) => {
    Song.findByIdAndDelete(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not delete song.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        try {
            await Collection.updateMany({ songs: doc._id }, { $pull: { songs: doc._id } })
        } catch (err) {
            if (err)
                console.log(err);
        }

        return res.send("Song deleted.")
    })
}

module.exports.getAllSongs = async (req, res) => {
    return res.json(await Song.find())
}

module.exports.getNewSongs = async (req, res) => {
    return res.json(await Song.find({ createdOn: { $gte: new Date(new Date() - 2 * 7 * 60 * 60 * 24 * 1000) } }))
}

module.exports.getPopularSongs = async (req, res) => {
    return res.json(await Song.find().sort({ plays: -1 }))
}

module.exports.getSongById = async (req, res) => {
    Song.findById(req.params.id).then(result => {
        if (!result)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        getPopulatedSong(result, res)
    }).catch(err => {
        return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)
    })
}

module.exports.getSongByUsernameAndSlug = async (req, res) => {
    User.findOne({ username: req.params.username }).then(result => {
        if (!result)
            return res.status(400).send(`User w/ username of ${req.params.username} does not exist.`)

        Song.findOne({ slug: req.params.slug, user: result._id }).then(r => {
            if (!r)
                return res.status(400).send(`Song w/ slug of ${req.params.slug} does not exist.`)

            getPopulatedSong(r, res)
        }).catch(err => {
            console.log(err);
            return res.status(500).send("Could not get song by username and slug.")
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).send("Could not get song by username and slug.")
    })
}

module.exports.getSongsByUserId = async (req, res) => {
    return res.json(await Song.find({ user: req.params.id }))
}

module.exports.removeComment = async (req, res) => {
    if (!(await utils.isOIdInDatabase(Comment, req.params.commentId))) {
        return res.status(400).send(`Comment w/ id of ${req.params.commentId} does not exist.`)
    }

    Song.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.commentId } }, { new: true }, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not remove comment.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        await Comment.deleteOne({ _id: req.params.commentId })

        getPopulatedSong(doc, res)
    })
}

module.exports.toggleCommentLike = async (req, res) => {
    if (!(await utils.isOIdInDatabase(User, req.params.likeUserId))) {
        return res.status(400).send(`User w/ id of ${req.params.likeUserId} does not exist.`)
    }

    if (!(await utils.isOIdInDatabase(Comment, req.params.commentId))) {
        return res.status(400).send(`Comment w/ id of ${req.params.commentId} does not exist.`)
    }

    Song.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not add like to comment.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        const commentId = await doc.comments.find(c => c == req.params.commentId)

        Comment.findById(commentId, async (e, d) => {
            if (e || !d)
                return res.status(400).send(`Comment does not belong to song.`)

            if (d.likes.includes(req.params.likeUserId))
                d.likes = d.likes.filter(l => l != req.params.likeUserId)
            else
                d.likes.push(req.params.likeUserId)

            await d.save()

            getPopulatedSong(doc, res)
        })
    })
}

module.exports.toggleLike = async (req, res) => {
    if (!(await utils.isOIdInDatabase(User, req.params.likeUserId))) {
        return res.status(400).send(`User w/ id of ${req.params.likeUserId} does not exist.`)
    }

    Song.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not update song.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        console.log(doc.likes);

        if (doc.likes.includes(req.params.likeUserId))
            doc.likes = doc.likes.filter(l => l != req.params.likeUserId)
        else
            doc.likes.push(req.params.likeUserId)

        await doc.save()

        return getPopulatedSong(doc, res)
    })
}

module.exports.updateSong = async (req, res) => {
    Song.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        plays: req.body.plays || 0,
        private: Boolean(req.body.private),
        releaseDate: req.body.releaseDate || moment(new Date).format("YYYY-MM-DD")
    }, { new: true, runValidators: true }, (err, doc) => {
        if (err) {
            if (err.errors) {
                return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
            }

            console.log(err);
            return res.status(400).send(`Could not update song.`)
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        getPopulatedSong(doc, res)
    })
}

module.exports.updateSongFile = async (req, res) => {
    const file = req.file

    if (file) {
      await uploadFile(file)
    }

    Song.findByIdAndUpdate(req.params.id, { fileUrl: file?.path }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not update song.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        getPopulatedSong(doc, res)
    })
}

module.exports.updateSongCover = async (req, res) => {
    const cover = req.file

    if (cover) {
      await uploadFile(cover)
    }

    Song.findByIdAndUpdate(req.params.id, { coverUrl: cover?.path }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not update song.")
        }

        if (!doc)
            return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

        getPopulatedSong(doc, res)
    })
}