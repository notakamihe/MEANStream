import { Component, OnInit } from '@angular/core';
import { Collection } from './../../models/Collection';
import { Comment } from './../../models/Comment';
import { Song } from './../../models/Song';
import User from './../../models/User';
import { CollectionService } from './../../services/collection/collection.service';
import { CurrentUserService } from './../../services/current-user/current-user.service';
import { SongService } from './../../services/song/song.service';
import { UserService } from './../../services/user/user.service';
import { includesIgnoreCase } from './../../utils/utils';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    public newSongs: Song[]
    public popular: Song[]
    
    public songs : Song[]
    public collections : Collection[]
    public users: User[]

    public term: string
    public searched: string

    public includesIgnoreCase : Function = includesIgnoreCase

    constructor(private userService: UserService, private songService: SongService, private collectionService : CollectionService, private currentUserService : CurrentUserService) { }

    ngOnInit(): void {
        this.songService.getNewSongs().subscribe((songs: Song[]) => {
            this.newSongs = songs.filter(s => this.currentUserService.isAuthorized(s.user) || !s.private)
        })
        
        this.songService.getPopularSongs().subscribe((songs: Song[]) => {
            this.popular = songs.filter(s => this.currentUserService.isAuthorized(s.user) || !s.private)
        })
        
        this.userService.getUsers().subscribe((users: User[]) => {
            this.users = users.sort(() => 0.5 - Math.random()).filter(u => u._id != this.currentUserService.user._id)
        })

        this.collectionService.getCollections().subscribe((collections : Collection[]) => {
            this.collections = collections.filter(c => this.currentUserService.isAuthorized(c.user._id) || !c.private).sort(() => 0.5 - Math.random())
        })

        this.songService.getSongs().subscribe((songs : Song[]) => {
            this.songs = songs.filter(s => this.currentUserService.isAuthorized(s.user) || !s.private)
        })
    }

    search() {
        this.searched = this.term
    }
}
