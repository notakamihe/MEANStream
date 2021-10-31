import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from './../../models/Song';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { toMonthShort } from "./../../utils/utils";

@Component({
    selector: 'app-create-song',
    templateUrl: './create-song.component.html',
    styleUrls: ['./create-song.component.css']
})
export class CreateSongComponent implements OnInit {
    public title: string
    public description: string
    public visibility: string = "public"
    public month: string = (new Date().getMonth() + 1).toString().padStart(2, "0")
    public day: string = new Date().getDate().toString().padStart(2, "0")
    public year: string = new Date().getFullYear().toString()

    public audio: File
    public cover: File
    public coverUri: string = 'assets/song-placeholder.png'

    public error: string
    public parseInt: Function = parseInt

    public toMonthShort: Function = toMonthShort

    constructor(private songService: SongService, private currentUserService: CurrentUserService, private router: Router) { }

    ngOnInit(): void {
    }

    handleAudio(e: Event) {
        this.audio = e[0]
    }

    handleCover(e: Event) {
        this.cover = e[0]
        this.coverUri = this.cover ? window.URL.createObjectURL(this.cover) : 'assets/song-placeholder.png'
    }

    handleCreateSong() {
        this.error = ""

        if (!this.audio) {
            this.error = "Must provide an audio track."
            window.scrollTo(0, 0)
            return
        }

        const releaseDate = `${this.year}-${this.month}-${this.day}`

        this.songService.createSong(this.description, this.visibility == "private", releaseDate, this.title, this.currentUserService.user._id).subscribe((song: Song) => {
            this.songService.updateSongFile(song._id, this.audio).subscribe((song2: Song) => {
                this.songService.updateSongCover(song._id, this.cover).subscribe((song3: Song) => {
                    this.router.navigate(
                      [`/tabs/users/${this.currentUserService.user.username}/songs/${song.slug}`], {
                        state: {isCreated: true}
                      }
                    )
                })
            })
        }, (error: ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}
