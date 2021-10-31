export default class User {
    _id : any
    createdOn : Date
    description : string
    email : string
    followers : any[]
    following : any[]
    password : string
    pfpUrl : string
    username : string

    constructor (user : any) {
      this._id = user._id
      this.createdOn = user.createdOn
      this.description = user.description
      this.email = user.email
      this.followers = user.followers
      this.following = user.following
      this.password = user.password
      this.pfpUrl = user.pfpUrl
      this.username = user.username
    }
}