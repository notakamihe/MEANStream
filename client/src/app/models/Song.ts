export class Song {
    _id: any
    comments: any[]
    coverUrl: string
    createdOn: Date
    description: string
    fileUrl: string
    likes: any[]
    plays: number
    private: boolean
    releaseDate: string
    slug: string
    title: string
    user: any

    constructor(song: any) {
        this._id = song._id
        this.comments = song.comments
        this.coverUrl = song.coverUrl
        this.createdOn = song.createdOn
        this.description = song.description
        this.fileUrl = song.fileUrl
        this.likes = song.likes
        this.plays = song.plays
        this.private = song.private
        this.releaseDate = song.releaseDate
        this.slug = song.slug
        this.title = song.title
        this.user = song.user
    }
}