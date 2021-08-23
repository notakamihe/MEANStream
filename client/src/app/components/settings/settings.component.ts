import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { deleteUser, logOut } from 'src/app/utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
    
    constructor(private electronService : ElectronService, private router : Router, private cus : CurrentUserService, private userService : UserService) { }
    
    ngOnInit(): void {
    }

    logOutUser () {
        logOut(this.cus, this.router)
    }

    deleteProfile () {
        deleteUser(this.electronService, this.userService, this.router, this.cus)
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
}
