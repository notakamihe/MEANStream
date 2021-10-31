import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from './../../models/Song';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { getFilename, getServerFileUrl, toMonthShort } from './../../utils/utils';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.css']
})
export class EditSongComponent implements OnInit {
    public song : Song

    public title : string
    public description : string
    public visibility : string = "public"

    public month : string = (new Date().getMonth() + 1).toString().padStart(2, "0")
    public day : string = new Date().getDate().toString().padStart(2, "0")
    public year : string = new Date().getFullYear().toString()
    
    public isAudioChanged : boolean = false
    public isCoverChanged : boolean = false

    public audio : File
    public cover : File
    public coverUri : string = 'assets/song-placeholder.png'

    public error : string

    public toMonthShort : Function = toMonthShort
    public getFilename : Function = getFilename
    public parseInt : Function = parseInt

    constructor(private route : ActivatedRoute, private songService : SongService, public router : Router, private currentUserService : CurrentUserService) { }

    ngOnInit(): void {
        const username: string = this.route.snapshot.paramMap.get("username")
        const slug: string = this.route.snapshot.paramMap.get("slug")

        this.songService.getSongBySlug(username, slug).subscribe((song: Song) => {
            this.song = song

            this.title = song.title
            this.description = song.description

            this.month = (new Date(song.releaseDate).getUTCMonth() + 1).toString().padStart(2, "0")
            this.day = new Date(song.releaseDate).getUTCDate().toString().padStart(2, "0")
            this.year = new Date(song.releaseDate).getUTCFullYear().toString()

            this.visibility = song.private ? "private" : "public"

            if (song.coverUrl)
                this.coverUri = getServerFileUrl(song.coverUrl)
        })
    }
    
    handleAudio (e : Event) {
        this.isAudioChanged = true
        this.audio = e[0]
    }

    handleCover (e : Event) {
        this.isCoverChanged = true
        this.cover = e[0]
        this.coverUri = this.cover ? window.URL.createObjectURL(this.cover) : 'assets/song-placeholder.png'
    }

    updateSong () {
        this.error = ""

        if (this.isAudioChanged && !this.audio) {
            this.error = "Must provide an audio track."
            window.scrollTo(0, 0)
            return
        }

        const releaseDate = `${this.year}-${this.month}-${this.day}`

        this.songService.updateSong(this.song._id, this.title, this.description, this.song.plays, 
            this.visibility == "private", releaseDate).subscribe(async (song : Song) => {
                if (this.isAudioChanged) {
                    song = await this.songService.updateSongFile(this.song._id, this.audio).toPromise()
                }

                if (this.isCoverChanged) {
                    song = await this.songService.updateSongCover(this.song._id, this.cover).toPromise()
                }

                this.router.navigateByUrl(`/tabs/users/${song.user.username}/songs/${song.slug}`, {
                  state: {isUpdated: true}
                }) 
            }, (error : ErrorEvent) => {
                this.error = error.error
                window.scrollTo(0, 0)
                return
            })
    }
}
