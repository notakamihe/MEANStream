import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from 'src/app/models/Song';
import User from 'src/app/models/User';
import { CurrentSongService } from 'src/app/services/current-song/current-song.service';
import { UserService } from 'src/app/services/user/user.service';
import { changeSong, getServerFileUrl, timeAgo } from 'src/app/utils/utils';
import numeral from "numeral";

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
    @Input() variant: string = "v1"
    @Input() song: Song
    @Input() showUsername: boolean = true

    public fileUrl: string
    public coverUrl: string
    public timeAgo: string
    public user: User

    public changeSong : Function = changeSong
    public numeral : any = numeral

    constructor(private router: Router, private userService: UserService, private currentSongService : CurrentSongService) { }

    ngOnInit(): void {
        this.fileUrl = this.getFile()
        this.coverUrl = this.getCover()
        this.timeAgo = timeAgo(this.song?.createdOn)

        if (this.song?.user?.constructor.name == "String") {
            this.userService.getUserById(this.song.user).subscribe((user: User) => {
                this.user = user
            })
        }
    }

    getFile(): string {
        if (this.song)
            return getServerFileUrl(this.song.fileUrl)

        return ""
    }

    getCover(): string {
        if (this.song && this.song.coverUrl)
            return getServerFileUrl(this.song.coverUrl)

        return "./assets/song-placeholder.png"
    }

    goToSongDetail() {
        this.router.navigate(["/users", "username", "songs", "my-song"])
    }
}
