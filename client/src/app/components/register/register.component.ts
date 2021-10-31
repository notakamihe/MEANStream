import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import User from './../../models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public username : string = ""
    public email : string = ""
    public password : string = ""
    public confirmPassword : string = ""
    public description : string = ""
    public pfp : File

    public pfpUri : string

    public error : string = ""

    constructor(private currentUserService : CurrentUserService, private router : Router, private userService : UserService) { }

    ngOnInit(): void {
      if (this.currentUserService.isLoggedIn()) {
          this.router.navigateByUrl("/tabs")
      }
    }

    handleChangePfp (files : FileList) {
        this.pfp = files[0]
        this.pfpUri = this.pfp ? window.URL.createObjectURL(this.pfp) : ""
    }

    signUp () {
      console.log(this.username, this.email, this.password, this.confirmPassword, this.description, this.pfp);

      if (this.password != this.confirmPassword) {
        this.error = "Passwords do not match."
        window.scrollTo(0, 0)
        return
    }

      this.userService.register(this.username, this.email, this.description, this.password).subscribe((token : any) => {
          this.userService.getUserFromToken(token.token).subscribe((user : User) => {
              this.userService.updateUserPfp(user._id, this.pfp).subscribe((user2 : User) => {
                this.currentUserService.user = user2
                localStorage.setItem("user", JSON.stringify(user2))
                this.router.navigateByUrl("/tabs")
              })
          })
      }, (error : ErrorEvent) => {
          this.error = error.error
          window.scrollTo(0, 0)
          return
      })
    }
}
