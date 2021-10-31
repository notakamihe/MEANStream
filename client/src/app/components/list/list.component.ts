import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from './../../models/Collection';
import { Comment } from './../../models/Comment';
import { Song } from './../../models/Song';
import User from './../../models/User';
import { CollectionService } from './../../services/collection/collection.service';
import { CommentService } from './../../services/comment/comment.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { UserService } from './../../services/user/user.service';
import { getServerFileUrl, isComment, isSong } from './../../utils/utils';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    public category: string
    public data: any[] = []
    public window: any = window
    public user: User
    public pfpUrl : string

    public isSong: Function = isSong
    public isComment: Function = isComment

    constructor(
        private router: Router, private route: ActivatedRoute, private userService: UserService,
        private currentUserService: CurrentUserService, private songService: SongService,
        private collectionService: CollectionService, private commentService: CommentService
    ) {

    }

    ngOnInit(): void {
        const windowLocationSplit: string[] = window.location.pathname.split("/")
        this.category = windowLocationSplit[windowLocationSplit.length - 1]
        this.setData(windowLocationSplit[windowLocationSplit.length - 1]);
    }

    navigateToHomeOrUserDetail() {
        if (this.user?._id == this.currentUserService.user._id) {
            this.router.navigateByUrl("/tabs")
            return
        }

        this.router.navigateByUrl(`/tabs/users/${this.user?.username}`)
    }

    setData(category) {
        this.userService.getUserByUsername(this.route.snapshot.paramMap.get("username")).subscribe((user: User) => {
            this.user = user
            this.pfpUrl = user.pfpUrl ? getServerFileUrl(user.pfpUrl) : "assets/images/default-pfp.png"

            switch (category) {
                case "songs":
                    this.songService.getSongsByUserId(user._id).subscribe((songs: Song[]) => {
                        if (this.currentUserService.isAuthorized(user._id))
                            this.data = songs
                        else
                            this.data = songs.filter(s => !s.private)
                    })

                    break
                case "collections":
                    this.collectionService.getCollectionsByUserId(user._id).subscribe((collections: Collection[]) => {
                        if (this.currentUserService.isAuthorized(user._id))
                            this.data = collections
                        else
                            this.data = collections.filter(s => !s.private)
                    })
                    break
                case "comments":
                    this.commentService.getCommentsByUser(user._id).subscribe((comments: Comment[]) => {
                        this.data = comments
                    })
                    break
                case "liked":
                    this.userService.getLikedByUserId(user._id).subscribe((liked: any) => {
                      this.data = [
                        ...liked.songs.map(s => new Song(s)), 
                        ...liked.comments.map(c => new Comment(c))
                      ]
                    })
                     
                    break
            }
        })
    }
}
