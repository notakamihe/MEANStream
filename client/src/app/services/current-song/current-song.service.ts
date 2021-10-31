import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Song } from './../../models/Song';

@Injectable({
  providedIn: 'root'
})
export class CurrentSongService {
    public songs : Song[]

    @Output() onChangeSong : EventEmitter<any> = new EventEmitter()

    constructor(private http : HttpClient) { 
        this.initializeData()
    }

    initializeData () {
        let data : Song[] = JSON.parse(localStorage.getItem("songs"))
        this.songs = data
    }

    change (songs : Song[]) {
        this.onChangeSong.emit(songs)
    }

    clear () {
      this.songs = []
      localStorage.removeItem("songs")
      this.change([])
    }

    getSong () : EventEmitter<any> {
        return this.onChangeSong
    }
}
