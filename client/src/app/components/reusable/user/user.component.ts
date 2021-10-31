import { Component, Input, OnInit } from '@angular/core';
import { Collection } from './../../../models/Collection';
import { Song } from './../../../models/Song';
import User from './../../../models/User';
import { CollectionService } from './../../../services/collection/collection.service';
import { SongService } from './../../../services/song/song.service';
import { getServerFileUrl } from './../../../utils/utils';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    @Input() user: User

    public pfpUrl : string
    public numSongs: number
    public numCollections: number

    constructor(private songService: SongService, private collectionService: CollectionService) { }

    ngOnInit(): void {
        this.songService.getSongsByUserId(this.user._id).subscribe((songs: Song[]) => {
            this.numSongs = songs.length
        })

        this.collectionService.getCollectionsByUserId(this.user._id).subscribe((collections: Collection[]) => {
            this.numCollections = collections.length
        })

        this.pfpUrl = this.user.pfpUrl ? getServerFileUrl(this.user.pfpUrl) : "assets/defaultpfp.jpg"
    }
}
