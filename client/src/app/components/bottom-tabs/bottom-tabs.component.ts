import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from './../../services/current-user/current-user.service';

@Component({
  selector: 'app-bottom-tabs',
  templateUrl: './bottom-tabs.component.html',
  styleUrls: ['./bottom-tabs.component.css']
})
export class BottomTabsComponent implements OnInit {
    public tab : string

    constructor(private router : Router, private currentUserService : CurrentUserService) { }

    ngOnInit(): void {
        this.switchTab("")

        if (!this.currentUserService.isLoggedIn())
            this.router.navigateByUrl("/")
    }

    switchTab (name) {
        this.tab = name
        this.router.navigate([`tabs/${this.tab}`])
    }
}
