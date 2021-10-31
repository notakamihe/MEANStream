import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() round : boolean = true
  @Input() showBorder : boolean = true
  @Input() size : number
  @Input() src : string

  constructor() { }

  ngOnInit(): void {
  }

}
