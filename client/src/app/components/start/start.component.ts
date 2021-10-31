import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from './../../services/current-user/current-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private currentUserService : CurrentUserService, private router : Router) { }

  ngOnInit(): void {
      if (this.currentUserService.isLoggedIn())
        this.router.navigateByUrl("/tabs")
  }

}
