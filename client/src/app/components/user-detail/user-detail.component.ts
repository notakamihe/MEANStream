import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Collection } from 'src/app/models/Collection';
import { Comment } from 'src/app/models/Comment';
import { Song } from 'src/app/models/Song';
import User from 'src/app/models/User';
import { CollectionService } from 'src/app/services/collection/collection.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { SongService } from 'src/app/services/song/song.service';
import { UserService } from 'src/app/services/user/user.service';
import { getServerFileUrl, isComment, isSong } from 'src/app/utils/utils';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    public user : User

    public songs: Song[]
    public collections: Collection[]
    public comments: Comment[]
    public liked: any[] = []
    public pfpUrl: string

    public isSong: Function = isSong
    public isComment: Function = isComment

    public isFollowed : boolean

    constructor(
        private route : ActivatedRoute, private songService: SongService, private router: Router,
        public currentUserService: CurrentUserService, private collectionService: CollectionService,
        private commentService: CommentService, private userService: UserService
    ) { }

    ngOnInit(): void {
        this.getData()
    }

    getData () {
        const username = this.route.snapshot.paramMap.get("username")
        
        this.userService.getUserByUsername(username).subscribe((user : User) => {
            this.user = user

            this.songService.getSongsByUserId(this.user._id).subscribe((songs: Song[]) => {
                this.songs = songs.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()).filter(s => this.currentUserService.isAuthorized(user._id) || !s.private)
            })
    
            this.collectionService.getCollectionsByUserId(this.user._id).subscribe((collections: Collection[]) => {
                this.collections = collections.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()).filter(c => this.currentUserService.isAuthorized(user._id) || !c.private)
            })
    
            this.commentService.getCommentsByUser(this.user._id).subscribe((comments: Comment[]) => {
                this.comments = comments.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
            })
    
            this.userService.getLikedByUserId(this.user._id).subscribe((liked: any[]) => {
                for (const like of liked) {
                    this.songService.getSongById(like._id).subscribe((song: Song) => {
                        if (this.currentUserService.isAuthorized(user._id) || !song.private) {
                            const newSong = new Song(song)
                            newSong.user = newSong.user._id
                            this.liked.unshift(newSong)
                        }
                    }, (error: ErrorEvent) => { })
    
                    this.commentService.getCommentById(like._id).subscribe((comment: Comment) => {
                        const newComment = new Comment(comment)
                        this.liked.unshift(newComment)
                    }, (error: ErrorEvent) => { })
                }
            })
    
            this.pfpUrl = this.user.pfpUrl ? getServerFileUrl(this.user.pfpUrl) : "./assets/defaultpfp.jpg"

            this.isFollowed = this.user.followers.map(f => f._id).includes(this.currentUserService.user._id)
        })
    }

    getJoinedOn(date): string {
        return moment(date).format("MMMM DD, YYYY")
    }

    toggleFollow () {
        if (this.isFollowed) {
            this.userService.removeFollower(this.user._id, this.currentUserService.user._id).subscribe((user : User) => {
                this.userService.removeFollowing(this.currentUserService.user._id, this.user._id).subscribe((user2 : User) => {
                    this.currentUserService.user.following = user2.following
                    this.getData()
                })
            })
        } else {
            this.userService.addFollower(this.user._id, this.currentUserService.user._id).subscribe((user : User) => {
                this.userService.addFollowing(this.currentUserService.user._id, this.user._id).subscribe((user2 : User) => {
                    this.currentUserService.user.following = user2.following
                    this.getData()
                })
            })
        }
    }
}
