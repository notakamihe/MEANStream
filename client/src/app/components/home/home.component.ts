import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ElectronService } from 'ngx-electron';
import { Collection } from './../../models/Collection';
import { Comment } from './../../models/Comment';
import { Song } from './../../models/Song';
import { CollectionService } from './../../services/collection/collection.service';
import { CommentService } from './../../services/comment/comment.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { UserService } from './../../services/user/user.service';
import { getServerFileUrl, isComment, isSong } from './../../utils/utils';

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
    ) { 
    }

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

        this.userService.getLikedByUserId(this.currentUserService.user._id).subscribe(async (liked: any) => {
          let newLiked = []

          liked.songs.filter(s => !s.private || this.currentUserService.isAuthorized(s.user._id))
            .forEach(s => {
              let newSong = new Song(s)
              newLiked.unshift(newSong)
            })

          for (const comment of liked.comments) {
            let newComment = new Comment(comment)
            newLiked.unshift(newComment)
          }

          this.liked = newLiked
        })

        this.pfpUrl = this.currentUserService.user.pfpUrl ? getServerFileUrl(this.currentUserService.user.pfpUrl) : "assets/defaultpfp.jpg"
    }
}
