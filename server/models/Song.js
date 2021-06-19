const mongoose = require("mongoose")
const slugify = require("slugify")
const moment = require("moment")

const songSchema = new mongoose.Schema({
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    coverUrl: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    fileUrl: {
        type: String
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    plays: {
        type: Number,
        default: 0
    },
    private: {
        type: Boolean,
        default: false
    },
    releaseDate: {
        type: String,
        default: moment(new Date()).format("YYYY-MM-DD")
    },
    slug: {
        type: String
    },
    title: {
        type: String,
        required: [true, "Song must have a title."]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User of song must be specified."]
    }
})

songSchema.pre("save", function (next) {
    this.slug = slugify(this.title, {lower: true, strict: true})
    next()
})

songSchema.pre("findOneAndUpdate", function (next) {
    if (this.getUpdate().title)
        this.update({}, {$set: {slug: slugify(this.getUpdate().title, {lower: true, strict: true})}})

    next()
})

songSchema.path("releaseDate").validate((releaseDate) => {
    const regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    return releaseDate.match(regex)
}, "Release date must be in the format of YYYY-MM-DD")

module.exports = mongoose.model("Song", songSchema)