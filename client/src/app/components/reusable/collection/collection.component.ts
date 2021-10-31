import { Component, Input, OnInit } from '@angular/core';
import { Collection } from './../../../models/Collection';
import { CurrentSongService } from './../../../services/current-song/current-song.service';
import { getServerFileUrl, getYear } from './../../../utils/utils';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
    @Input() variant : string = "v1"
    @Input() collection : Collection
    @Input() showUsername : boolean = true
    @Input() isSongInCollection : boolean = false

    public coverUrl : string
    public year : number

    constructor(private currentSongService : CurrentSongService) { }

    ngOnInit(): void {
        this.coverUrl = this.getCover()
        this.year = getYear(this.collection?.releaseDate)
    }

    getCover () : string {
        if (this.collection && this.collection.coverUrl)
            return getServerFileUrl(this.collection.coverUrl)

        return "assets/collection-placeholder.png"
    }

    changeSong () {
        localStorage.setItem("songs", JSON.stringify(this.collection.songs))
        this.currentSongService.change(this.collection.songs)
    }
}
