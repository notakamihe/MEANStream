import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ElectronService } from 'ngx-electron';
import { Collection } from 'src/app/models/Collection';
import { Comment } from 'src/app/models/Comment';
import { Song } from 'src/app/models/Song';
import { CollectionService } from 'src/app/services/collection/collection.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { SongService } from 'src/app/services/song/song.service';
import { UserService } from 'src/app/services/user/user.service';
import { deleteUser, getServerFileUrl, isComment, isSong } from 'src/app/utils/utils';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public songs: Song[]
    public collections: Collection[]
    public comments: Comment[]
    public liked: any[] = []
    public pfpUrl: string

    public isSong: Function = isSong
    public isComment: Function = isComment

    constructor(
        private songService: SongService, private router: Router,
        public currentUserService: CurrentUserService, private collectionService: CollectionService,
        private commentService: CommentService, private userService: UserService, private electronService : ElectronService
    ) { }

    ngOnInit(): void {
        this.songService.getSongsByUserId(this.currentUserService.user._id).subscribe((songs: Song[]) => {
            this.songs = songs.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
        })

        this.collectionService.getCollectionsByUserId(this.currentUserService.user._id).subscribe((collections: Collection[]) => {
            this.collections = collections.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
        })

        this.commentService.getCommentsByUser(this.currentUserService.user._id).subscribe((comments: Comment[]) => {
            this.comments = comments.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
        })

        this.userService.getLikedByUserId(this.currentUserService.user._id).subscribe((liked: any[]) => {
            for (const like of liked) {
                this.songService.getSongById(like._id).subscribe((song: Song) => {
                    const newSong = new Song(song)
                    newSong.user = newSong.user._id
                    this.liked.unshift(newSong)
                }, (error: ErrorEvent) => { })

                this.commentService.getCommentById(like._id).subscribe((comment: Comment) => {
                    const newComment = new Comment(comment)
                    this.liked.unshift(newComment)
                }, (error: ErrorEvent) => { })
            }
        })

        this.pfpUrl = this.currentUserService.user.pfpUrl ? getServerFileUrl(this.currentUserService.user.pfpUrl) : "./assets/defaultpfp.jpg"
    }

    deleteProfile () {
        deleteUser(this.electronService, this.userService, this.router, this.currentUserService)
    }

    getJoinedOn(date): string {
        return moment(date).format("MMMM DD, YYYY")
    }
}
