import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from './../../../models/Comment';
import { Song } from './../../../models/Song';
import User from './../../../models/User';
import { CommentService } from './../../../services/comment/comment.service';
import { CurrentUserService } from './../../../services/current-user/current-user.service';
import { SongService } from './../../../services/song/song.service';
import { UserService } from './../../../services/user/user.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @Input() variant: string = "v1"
    @Input() comment: Comment
    @Input() showUsername: boolean = false

    @Output() onReply : EventEmitter<any> = new EventEmitter<any>()
    @Output() onRemove : EventEmitter<any> = new EventEmitter<any>()
    @Output() onRemoveNoReply : EventEmitter<any> = new EventEmitter<any>()

    public song: Song
    public replies: Comment[]
    public user: User

    public isLiked : boolean

    public reply : string
    public error : string
    public replyMode: boolean = false
    public showReplies: boolean = false

    constructor(
        private commentService: CommentService, private userService: UserService, 
        private songService : SongService, public currentUserService : CurrentUserService
    ) { }

    ngOnInit(): void {
        this.getData()
    }

    addReply () {
        this.error = ""

        this.songService.addCommentToSong(this.song._id, this.reply, this.currentUserService.user._id, this.comment._id).subscribe((song : Song) => {
            console.log(song.comments);

            this.getData()
            this.emitOnReply()

            this.showReplies = true
            this.reply = ""
            this.replyMode = false
        }, (error : ErrorEvent) => {
            this.error = error.error
        })
    }
    
    emitOnReply () {
        this.onReply.emit()
    }

    emitOnRemove () {
        this.onRemove.emit()

        if (!this.comment.repliedTo) {
            this.onRemoveNoReply.emit()
        }
    }

    getData () {
        this.commentService.getReplies(this.comment._id).subscribe((replies: Comment[]) => {
            this.replies = replies
        })

        this.commentService.getSong(this.comment._id).subscribe((song: Song) => {
            this.song = song

            if (song)
                this.userService.getUserById(song.user).subscribe((user: User) => {
                    this.user = user
                })
        })

        this.isLiked = 
            this.comment.likes.map(l => l._id).includes(this.currentUserService.user._id) ||
            this.comment.likes.includes(this.currentUserService.user._id)
    }

    removeComment () {
        this.songService.removeSongComment(this.song._id, this.comment._id).subscribe((song : Song) => {
            this.emitOnRemove()
        })
    }

    toggleLike () {
        this.songService.toggleSongCommentLike(this.song._id, this.comment._id, this.currentUserService.user._id).subscribe((song : Song) => {
            this.isLiked = !this.isLiked
        })
    }
}
