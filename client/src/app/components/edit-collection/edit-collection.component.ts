import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from './../../models/Collection';
import { CollectionService } from './../../services/collection/collection.service';
import { getFilename, getServerFileUrl, toMonthShortNatural } from './../../utils/utils';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
    public collection : Collection

    public title: string
    public description: string
    public visibility: string = "public"
    public category: string = "collection"

    public month : string = (new Date().getMonth() + 1).toString().padStart(2, "0")
    public day : string = new Date().getDate().toString().padStart(2, "0")
    public year : string = new Date().getFullYear().toString()
    
    public cover : File
    public coverUri : string = 'assets/collection-placeholder.png'
    public isCoverChanged : boolean = false

    public error : string

    public toMonthShortNatural : Function = toMonthShortNatural
    public getFilename : Function = getFilename

    constructor(private route : ActivatedRoute, private collectionService : CollectionService, public router : Router) { }

    ngOnInit(): void {
        const username: string = this.route.snapshot.paramMap.get("username")
        const slug: string = this.route.snapshot.paramMap.get("slug")

        this.collectionService.getCollectionBySlug(username, slug).subscribe((collection: Collection) => {
            this.collection = collection

            this.title = collection.title
            this.description = collection.description
            this.category = collection.category

            this.month = (new Date(collection.releaseDate).getUTCMonth() + 1).toString().padStart(2, "0")
            this.day = new Date(collection.releaseDate).getUTCDate().toString().padStart(2, "0")
            this.year = new Date(collection.releaseDate).getUTCFullYear().toString()

            this.visibility = collection.private ? "private" : "public"

            if (collection.coverUrl)
                this.coverUri = getServerFileUrl(collection.coverUrl)
        })
    }

    handleCover (e : Event) {
        this.isCoverChanged = true
        this.cover = e[0]
        this.coverUri = this.cover ? window.URL.createObjectURL(this.cover) : 'assets/collection-placeholder.png'
    }

    updateCollection () {
        this.error = ""

        const releaseDate = `${this.year}-${this.month}-${this.day}`

        this.collectionService.updateCollection(this.collection._id, this.category, this.description, this.visibility == "private", releaseDate, this.title).subscribe(async (collection : Collection) => {
            if (this.isCoverChanged) {
                collection = await this.collectionService.updateCollectionCover(this.collection._id, this.cover).toPromise()
            }

            this.router.navigate([`/tabs/users/${collection.user.username}/collections/${collection.slug}`], {
              state: {isUpdated: true}
            }) 
        }, (error : ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}
