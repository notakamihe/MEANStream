import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Collection } from './../../../models/Collection';
import { Song } from './../../../models/Song';
import { CollectionService } from './../../../services/collection/collection.service';
import { CurrentUserService } from './../../../services/current-user/current-user.service';
import { includesIgnoreCase } from './../../../utils/utils';

@Component({
  selector: 'app-add-to-playlist-modal',
  templateUrl: './add-to-playlist-modal.component.html',
  styleUrls: ['./add-to-playlist-modal.component.css']
})
export class AddToPlaylistModalComponent implements OnInit {
    @Input() song : Song
    
    @Output() onClose : EventEmitter<any> = new EventEmitter()

    public collections : Collection[]
    public term : string = ""

    public includesIgnoreCase : Function = includesIgnoreCase

    constructor(private collectionService : CollectionService, private currentUserService : CurrentUserService, private router : Router) { }

    ngOnInit(): void {
        this.getData()
    }

    close () {
        this.onClose.emit()
    }
    
    getData () {
        this.collectionService.getCollectionsByUserId(this.currentUserService.user._id).subscribe((collections : Collection[]) => {
            this.collections = collections
        })
    }

    isSongInCollection (collection : Collection) : boolean {
        return collection.songs.map(s => s._id).includes(this.song?._id)
    }
    
    toggleAddToCollection (collection : Collection) {
        if (this.isSongInCollection(collection)) {
            this.collectionService.removeCollectionSong(collection._id, this.song._id).subscribe((c : Collection) => {
                this.getData()
            })
        } else {
            this.collectionService.addCollectionSong(collection._id, this.song._id).subscribe((c : Collection) => {
                this.getData()
            })
        }
    }
}
