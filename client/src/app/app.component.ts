import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from './services/current-user/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'frontend2';

    constructor (public currentUserService : CurrentUserService) {}

    ngOnInit () : void {
    }
}
