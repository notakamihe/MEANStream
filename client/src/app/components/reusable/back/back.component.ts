import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit {
    @Input() disabled : boolean = false

    constructor() { }

    ngOnInit(): void {
    }

    goBack () {
        if (!this.disabled)
            window.history.back()
    }
}
