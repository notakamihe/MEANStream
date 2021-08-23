import { Component, Input, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/Collection';
import { Song } from 'src/app/models/Song';
import User from 'src/app/models/User';
import { CollectionService } from 'src/app/services/collection/collection.service';
import { SongService } from 'src/app/services/song/song.service';
import { getServerFileUrl } from 'src/app/utils/utils';

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

        this.pfpUrl = this.user.pfpUrl ? getServerFileUrl(this.user.pfpUrl) : "./assets/defaultpfp.jpg"
    }
}
