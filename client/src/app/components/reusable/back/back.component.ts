import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit {
    @Input() disabled : boolean = false
    @Input() url : string

    constructor(private router : Router) { }

    ngOnInit(): void {
    }

    goBack () {
        if (!this.disabled){
          if (this.url) {
            this.router.navigateByUrl(this.url)
          } else {
            window.history.back()
          }
        }
    }
}
