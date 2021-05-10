export class Comment {
    _id: any
    content: string
    createdOn: Date
    likes: any[]
    repliedTo: any
    user: any

    constructor(comment: Comment) {
        this._id = comment._id
        this.content = comment.content
        this.createdOn = comment.createdOn
        this.likes = comment.likes
        this.repliedTo = comment.repliedTo
        this.user = comment.user
    }
}