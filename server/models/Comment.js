const mongoose = require("mongoose")

const Song = require("./Song")

var options = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
};

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, "Content of comment mustn't be blank."]
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User of comment must be specified."]
    }
}, options)

commentSchema.method('in', function () {
    return "hi"
});

commentSchema.pre('deleteMany', async function (next) {
    try {
        let deletedData = await this.find(this._conditions).lean()

        deletedData.forEach(async doc => {
            await Song.updateMany({comments: doc._id}, {$pull: {comments: doc._id}})
        })
        
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("Comment", commentSchema)