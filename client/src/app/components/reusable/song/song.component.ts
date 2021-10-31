import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from './../../../models/Song';
import User from './../../../models/User';
import { CurrentSongService } from './../../../services/current-song/current-song.service';
import { UserService } from './../../../services/user/user.service';
import { changeSong, getServerFileUrl } from './../../../utils/utils';

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
    public user: User

    public changeSong : Function = changeSong

    constructor(private router: Router, private userService: UserService, public currentSongService : CurrentSongService) { }

    ngOnInit(): void {
        this.fileUrl = this.getFile()
        this.coverUrl = this.getCover()

        if (typeof this.song?.user === "string" || this.song?.user instanceof String) {
          this.userService.getUserById(String(this.song.user)).subscribe((user: User) => {
              this.user = user
          })
        } else {
          this.user = new User(this.song?.user)
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

        return "assets/song-placeholder.png"
    }

    goToSongDetail() {
        this.router.navigate(["/users", "username", "songs", "my-song"])
    }
}
