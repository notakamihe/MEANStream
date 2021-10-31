import { Component, OnInit } from '@angular/core';
import User from './../../models/User';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { UserService } from './../../services/user/user.service';
import { getServerFileUrl } from './../../utils/utils';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
    public username : string
    public email : string
    public description : string
    public pfp : File

    public uri : string

    public isPfpChanged : boolean = false

    public error : string

    constructor(private currentUserService : CurrentUserService, private userService : UserService) { }

    ngOnInit(): void {
        this.username = this.currentUserService.user.username
        this.email = this.currentUserService.user.email
        this.description = this.currentUserService.user.description

        if (this.currentUserService.user.pfpUrl)
            this.uri = getServerFileUrl(this.currentUserService.user.pfpUrl)
    }

    handleChangePfp (files : FileList) {
        this.isPfpChanged = true
        this.pfp = files[0]
        this.uri = this.pfp ? window.URL.createObjectURL(this.pfp) : ""
    }

    updateProfile () {
        this.userService.updateUser(this.currentUserService.user._id, this.username, this.email, this.description).subscribe(async (user : User) => {
            if (this.isPfpChanged) {
                user = await this.userService.updateUserPfp(this.currentUserService.user._id, this.pfp).toPromise()
            }

            localStorage.setItem("user", JSON.stringify(user))
            this.currentUserService.user = user
            window.history.back()
        }, (error : ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}
