import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from './../../models/Collection';
import { CollectionService } from './../../services/collection/collection.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { toMonthShort } from "./../../utils/utils";

@Component({
    selector: 'app-create-collection',
    templateUrl: './create-collection.component.html',
    styleUrls: ['./create-collection.component.css']
})
export class CreateCollectionComponent implements OnInit {
    public title: string
    public description: string
    public visibility: string = "public"
    public category: string = "collection"
    public month: string = (new Date().getMonth() + 1).toString().padStart(2, "0")
    public day: string = new Date().getDate().toString().padStart(2, "0")
    public year: string = new Date().getFullYear().toString()

    public cover: File
    public coverUri: string = 'assets/collection-placeholder.png'

    public error: string
    public parseInt: Function = parseInt

    public toMonthShort: Function = toMonthShort

    constructor(private currentUserService : CurrentUserService, private collectionService : CollectionService, private router : Router) { }

    ngOnInit(): void {
    }

    handleCover(e: Event) {
        this.cover = e[0]
        this.coverUri = this.cover ? window.URL.createObjectURL(this.cover) : 'assets/collection-placeholder.png'
    }

    handleCreateCollection () {
        const releaseDate = `${this.year}-${this.month}-${this.day}`

        this.collectionService.createCollection(this.category, this.description, this.visibility == "private",
         releaseDate, this.title, this.currentUserService.user._id).subscribe((collection : Collection) => {
            this.collectionService.updateCollectionCover(collection._id, this.cover).subscribe((collection2 : Collection) => {
                this.router.navigate(
                  [`/tabs/users/${this.currentUserService.user.username}/collections/${collection2.slug}`],
                  {state: {isCreated: true}}
                )
            })
        }, (error : ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}
