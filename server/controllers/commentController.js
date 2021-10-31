const Comment = require("./../models/Comment")
const Song = require("../models/Song")
const User = require("../models/User")

const { isOIdInDatabase } = require("../utils/utils")

const getPopulatedComment = (comment, res) => {
    return comment.populate("user").populate("likes").populate(
        {
            path: "repliedTo",
            model: "Comment",
            populate: {
                path: "user",
                model: "User"
            }
        }
    ).execPopulate((err, doc) => {
        return res.json(doc)
    })
}

const getPopulatedComments = (comments, res) => {
    return comments.populate("user").populate("likes").populate(
        {
            path: "repliedTo",
            model: "Comment",
            populate: {
                path: "user",
                model: "User"
            }
        }
    ).exec((err, docs) => {
        return res.json(docs)
    })
}

module.exports.deleteComment = async (req, res) => {
  Comment.findByIdAndDelete(req.params.id, async (err, doc) => {
    if (err || !doc) {
      console.log(err)
      return res.status(400).send("Could not get comment.")
    }

    return res.send("Comment successfully deleted.")
  })
}

module.exports.getAllComments = async (req, res) => {
    return getPopulatedComments(Comment.find(), res)
}

module.exports.getCommentById = async (req, res) => {
    Comment.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get comment.")
        }

        if (!doc)
            return res.status(400).send(`Comment w/ id of ${req.params.id} does not exist.`)

        return getPopulatedComment(doc, res)
    })
}

module.exports.getCommentsByUser = async (req, res) => {
    if (!(await isOIdInDatabase(User, req.params.id)))
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

    return getPopulatedComments(Comment.find({user: req.params.id}), res)
}

module.exports.getCommentReplies = async (req, res) => {
    Comment.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get comment.")
        }

        if (!doc)
            return res.status(400).send(`Comment w/ id of ${req.params.id} does not exist.`)

        getPopulatedComments(Comment.find({repliedTo: req.params.id}), res)
    })
}

module.exports.getCommentSong = async (req, res) => {
    Comment.findById(req.params.id, async (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get comment.")
        }

        if (!doc)
            return res.status(400).send(`Comment w/ id of ${req.params.id} does not exist.`)

        return res.json(await Song.findOne({comments: doc._id}))
    })
}

