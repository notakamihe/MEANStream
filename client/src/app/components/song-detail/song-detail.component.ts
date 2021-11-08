import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { Collection } from './../../models/Collection';
import { Comment } from './../../models/Comment';
import { Song } from './../../models/Song';
import User from './../../models/User';
import { CollectionService } from './../../services/collection/collection.service';
import { CurrentSongService } from './../../services/current-song/current-song.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { UserService } from './../../services/user/user.service';
import { changeSong, getServerFileUrl } from './../../utils/utils';
import { filter, pairwise } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-song-detail',
    templateUrl: './song-detail.component.html',
    styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
    public song: Song
    public comments: Comment[] = []
    public commentsLength : number = 0
    public coverUrl: string
    public inCollections: Collection[]

    public comment : string
    public error : string
    public commentMode: boolean = false
    
    public isLiked : boolean

    public changeSong : Function = changeSong

    public backUrl : string

    constructor(
        private route: ActivatedRoute, private userService: UserService, private songService: SongService, private collectionService: CollectionService, public currentUserService : CurrentUserService,
        private router : Router, private electronService : ElectronService, public currentSongService : CurrentSongService, private modalService : NgbModal
    ) {
      if (this.router.getCurrentNavigation().extras.state?.isCreated)
        this.backUrl = "/tabs/create"
      else if (this.router.getCurrentNavigation().extras.state?.isUpdated)
        this.backUrl = "/tabs"
    }

    ngOnInit(): void {
      this.getData()
    }

    addComment () { 
        this.songService.addCommentToSong(this.song._id, this.comment, this.currentUserService.user._id, null).subscribe((song : Song) => {
            this.comment = ""
            this.commentMode = false
            this.getData()
        }, (error : ErrorEvent) => {
            this.error = error.error
        })
    }

    deleteSong () {
        const options = {
            title: "Delete song",
            buttons: ["Yes", "Cancel"],
            message: "Confirm?"
        }

        const num = this.electronService.remote.dialog.showMessageBoxSync(null, options)        

        if (num == 0) {
            this.songService.deleteSong(this.song._id).subscribe(() => {
            }, (error : ErrorEvent) => {
                this.router.navigateByUrl("/tabs")  
            })
        } 
    }

    getCollectionCoverUrl(collection: Collection): string {
        if (collection.coverUrl)
            return getServerFileUrl(collection.coverUrl)

        return "assets/collection-placeholder.png"
    }

    getData () {
        const username: string = this.route.snapshot.paramMap.get("username")
        const slug: string = this.route.snapshot.paramMap.get("slug")

        this.songService.getSongBySlug(username, slug).subscribe((song: Song) => {
            this.song = song
            this.coverUrl = song?.coverUrl ? getServerFileUrl(song?.coverUrl) : "assets/song-placeholder.png"
            this.isLiked = song.likes.map(l => l._id).includes(this.currentUserService.user._id)

            this.collectionService.getCollectionsBySongId(song._id).subscribe((collections: Collection[]) => {
                this.inCollections = collections
            })

            this.comments = []

            for (const c of song.comments) {
                const comment: Comment = c as Comment

                if (!comment.repliedTo)
                    this.comments.push(comment)
            }

            this.comments = this.comments.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
            this.commentsLength = song.comments.length
        })
    }

    open(content) {
      if (this.song) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        }, (reason) => {
        });
      }
    }

    toggleLike () {
        this.songService.toggleSongLike(this.song._id, this.currentUserService.user._id).subscribe((song : Song) => {
            this.getData()
        })
    }

    incrementComments () {
        console.log("Incrementing comments");
        this.commentsLength++
    }

    decrementComments () {
        console.log("Decrementing comments");
        this.commentsLength--
    }
}
