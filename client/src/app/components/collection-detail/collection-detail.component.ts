import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from "ngx-electron"
import { Collection } from './../../models/Collection';
import { Song } from './../../models/Song';
import { CollectionService } from './../../services/collection/collection.service';
import { CurrentSongService } from './../../services/current-song/current-song.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { changeSong, getServerFileUrl, getYear, includesIgnoreCase } from './../../utils/utils';

@Component({
    selector: 'app-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {
    public collection: Collection
    public coverUrl: string
    public year: number
    
    public changeSong : Function = changeSong
    public includesIgnoreCase : Function = includesIgnoreCase

    public term: string = ""
    public editMode: boolean = false

    public songs : Song[]
    public allSongs : Song[]

    public backUrl : string

    constructor(
        private route: ActivatedRoute, private collectionService: CollectionService, 
        public currentSongService : CurrentSongService, private electronService : ElectronService,
        private router : Router, private songService : SongService, public currentUserService : CurrentUserService
    ) {
      if (this.router.getCurrentNavigation().extras.state?.isCreated)
        this.backUrl = "/tabs/create"
      else if (this.router.getCurrentNavigation().extras.state?.isUpdated)
        this.backUrl = "/tabs"
    }

    ngOnInit(): void {
        this.getData().then(collection => {
            this.songService.getSongs().subscribe((songs : Song[]) => {
                this.allSongs = songs.filter(s => this.currentUserService.isAuthorized(s?.user) || !s.private)
            })
        })
    }

    addTrack(song: Song) {
        this.songs.push(song)
    }

    deleteCollection () {
        const options = {
            title: "Delete collection",
            buttons: ["Yes", "Cancel"],
            message: "Confirm?"
        }

        const num = this.electronService.remote.dialog.showMessageBoxSync(null, options)        

        if (num == 0) {
            this.collectionService.deleteCollection(this.collection._id).subscribe(() => {
            }, (error : ErrorEvent) => {
                this.router.navigateByUrl("/tabs")  
            })
        } 
    }

    async getData () {
        const username: string = this.route.snapshot.paramMap.get("username")
        const slug: string = this.route.snapshot.paramMap.get("slug")

        this.collectionService.getCollectionBySlug(username, slug).subscribe((collection: Collection) => {
            this.collection = collection
            this.coverUrl = collection?.coverUrl ? getServerFileUrl(collection?.coverUrl) : "assets/collection-placeholder.png"
            this.year = getYear(collection?.releaseDate)

            if (this.currentUserService.isAuthorized(collection.user._id))
                this.songs = collection.songs
            else
                this.songs = collection.songs.filter(s => !s.private)
        })

        return this.collection
    }

    isInSongs(song: Song): boolean {
        return this.songs.map(s => s._id).includes(song._id)
    }

    removeTrack(i: number) {
        this.songs = this.songs.slice(0, i).concat(this.songs.slice(i + 1))
    }

    updateSongs () {
        this.editMode = false

        this.collectionService.updateCollectionSongs(this.collection._id, this.songs.map(s => s._id)).subscribe((collection : Collection) => {
            this.getData()
        })
    }
}
