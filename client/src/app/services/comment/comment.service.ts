import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from './../../models/Song';
import environment from './../../../environments/environment';
import { Comment } from "../../models/Comment"

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(private http: HttpClient) { }

    getComments (): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${environment.BASE_SERVER_URL}api/comments`)
    }

    getCommentById(id: string): Observable<Comment> {
        return this.http.get<Comment>(`${environment.BASE_SERVER_URL}api/comments/${id}`)
    }

    getCommentsByUser(id: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${environment.BASE_SERVER_URL}api/comments/user/${id}`)
    }

    getReplies(id: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${environment.BASE_SERVER_URL}api/comments/${id}/replies`)
    }

    getSong(id: string): Observable<Song> {
        return this.http.get<Song>(`${environment.BASE_SERVER_URL}api/comments/${id}/song`)
    }
}
