import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { CurrentSongService } from '../../services/current-song/current-song.service';
import { ThemeService } from '../../services/theme/theme.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { UserService } from './../../services/user/user.service';
import { deleteUser, logOut } from './../../utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
    tabIdx : number = 0
    darkMode : boolean
    
    constructor(private electronService : ElectronService, private router : Router, private cus : CurrentUserService, private css : CurrentSongService, private userService : UserService, public themeService : ThemeService) { 
      this.darkMode = themeService.darkMode
    }
    
    ngOnInit(): void {
    }

    logOutUser () {
        logOut(this.cus, this.router, this.css)
    }

    deleteProfile () {
        deleteUser(this.electronService, this.userService, this.router, this.cus, this.css)
    }

    openGithub () {
        this.electronService.shell.openExternal("https://github.com/notakamihe/MEAN-Streaming-and-Player/issues")
    }

    privateAll () {
        this.userService.privateAll(this.cus.user._id).subscribe((res : any) => {})
    }

    removeAllLikesAndComments () {
        this.userService.removeAllLikesComments(this.cus.user._id).subscribe((res : any) => {})
    }

    toggleTheme() {
      this.darkMode = !this.darkMode
      console.log(this.darkMode)
      this.themeService.setDarkMode(this.darkMode)
    }
}
