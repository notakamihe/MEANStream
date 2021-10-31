const mongoose = require("mongoose")
const slugify = require("slugify")
const moment = require("moment")

const Song = require("./Song")

var options = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
};

const collectionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: {
            values: ["collection", "playlist", "ep", "album", "lp", "compilation", "mixtape"],
            message: "Invalid category name. Must be collection, playlist, ep, album, lp, compilation or mixtape."
        },
        required: [true, "Must specify a collection category (collection/playlist/ep/album/lp/compilation/mixtape)."]
    },
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
    songs: [{type: mongoose.Schema.Types.ObjectId, ref: "Song"}],
    title: {
        type: String,
        required: [true, "Collection must have a title."]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, options)

collectionSchema.pre("save", function (next) {
    this.slug = slugify(this.title, {lower: true, strict: true})
    next()
})

collectionSchema.pre("findOneAndUpdate", function (next) {
    if (this.getUpdate().title)
        this.update({}, {$set: {slug: slugify(this.getUpdate().title, {lower: true, strict: true})}})

    next()
})

collectionSchema.path("releaseDate").validate((releaseDate) => {
    const regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    return releaseDate.match(regex)
}, "Release date must be in the format of YYYY-MM-DD")

collectionSchema.virtual("totalLikes").get(function () {
    let sum = 0

    this.songs.forEach(s => sum += s.likes.length)

    return sum
})

collectionSchema.virtual("totalPlays").get(function () {
    let sum = 0

    this.songs.forEach(s => sum += s.plays)

    return sum
})

collectionSchema.virtual("totalComments").get(function () {
    let sum = 0

    this.songs.forEach(s => sum += s.comments.length)

    return sum
})

module.exports = mongoose.model("Collection", collectionSchema)