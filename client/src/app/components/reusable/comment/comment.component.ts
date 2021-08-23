import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/models/Comment';
import { Song } from 'src/app/models/Song';
import User from 'src/app/models/User';
import { CommentService } from 'src/app/services/comment/comment.service';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { SongService } from 'src/app/services/song/song.service';
import { UserService } from 'src/app/services/user/user.service';
import { timeAgo, toMMMMDDYYYY } from 'src/app/utils/utils';

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

    public timeAgo: Function = timeAgo
    public toMMMMDDYYYY: Function = toMMMMDDYYYY

    constructor(
        private commentService: CommentService, private userService: UserService, 
        private songService : SongService, private currentUserService : CurrentUserService
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
