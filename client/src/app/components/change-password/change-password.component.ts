import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    public password : string
    public confirmPassword : string

    public error : string

    constructor(private userService : UserService, private currentUserService : CurrentUserService, private router : Router) { }

    ngOnInit(): void {
    }

    changePassword () {
        this.error = ""
        
        if (this.password != this.confirmPassword) {
            this.error = "Passwords do not match."
            window.scrollTo(0, 0)
            return
        }

        this.userService.changePassword(this.currentUserService.user._id, this.password).subscribe((user : User) => {
            window.history.back()
        }, (error : ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}
