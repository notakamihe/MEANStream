import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import { CurrentUserService } from 'src/app/services/current-user/current-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public usernameOrEmail : string
    public password : string

    public error : string

    constructor(private userService : UserService, private router : Router, private currentUserService : CurrentUserService) { }

    ngOnInit(): void {
        if (this.currentUserService.isLoggedIn()) {
            this.router.navigateByUrl("/tabs")
        }
    }

    logIn () {
        this.userService.logIn(this.usernameOrEmail, this.password).subscribe((token : any) => {
            this.userService.getUserFromToken(token.token).subscribe((user : User) => {
                this.currentUserService.user = user
                localStorage.setItem("user", JSON.stringify(user))
                this.router.navigateByUrl("/tabs")
            })
        }, (error : ErrorEvent) => {
            this.error = error.error
            window.scrollTo(0, 0)
            return
        })
    }
}