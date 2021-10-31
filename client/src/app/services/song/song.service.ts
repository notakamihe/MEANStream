import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from './../../models/Song';
import environment from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SongService {
    constructor(private http: HttpClient) { }

    addCommentToSong (id : string, content : string, user : string, repliedTo : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}/add-comment`, {
            content,
            repliedTo,
            user
        })
    }

    addPlayToSong (id : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}/add-play`, {})
    }

    createSong(description: string, isPrivate: boolean, releaseDate: string, title: string, user: string): Observable<Song> {
        return this.http.post<Song>(`${environment.BASE_SERVER_URL}api/songs`, {
            title,
            description,
            private: isPrivate,
            releaseDate,
            user
        })
    }

    deleteSong (id : string) : Observable<any> {
        return this.http.delete<any>(`${environment.BASE_SERVER_URL}api/songs/${id}`)
    }

    getNewSongs(): Observable<Song[]> {
        return this.http.get<Song[]>(`${environment.BASE_SERVER_URL}api/songs/new`)
    }

    getPopularSongs(): Observable<Song[]> {
        return this.http.get<Song[]>(`${environment.BASE_SERVER_URL}api/songs/popular`)
    }
    
    getSongs(): Observable<Song[]> {
        return this.http.get<Song[]>(`${environment.BASE_SERVER_URL}api/songs`)
    }

    getSongById(id: string): Observable<Song> {
        return this.http.get<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}`)
    }

    getSongBySlug(username: string, slug: string): Observable<Song> {
        return this.http.get<Song>(`${environment.BASE_SERVER_URL}api/songs/${username}/${slug}`)
    }

    getSongsByUserId(id: string): Observable<Song[]> {
        return this.http.get<Song[]>(`${environment.BASE_SERVER_URL}api/songs/user/${id}`)
    }

    removeSongComment (songId : string, commentId : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${songId}/remove-comment/${commentId}`, {})
    }

    toggleSongCommentLike (songId : string, commentId : string, userId : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${songId}/comments/${commentId}/toggle-like/${userId}`, {})
    }

    toggleSongLike (songId : string, userId : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${songId}/toggle-like/${userId}`, {})
    }

    updateSong (id : string, title : string, description : string, plays : number, isPrivate : boolean, releaseDate : string) : Observable<Song> {
        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}`, {
            title,
            description,
            plays,
            private: isPrivate,
            releaseDate
        })
    }

    updateSongFile(id: string, file: File): Observable<Song> {
        let formData = new FormData()
        formData.append("file", file)

        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}/change-file`, formData)
    }

    updateSongCover(id: string, cover: File): Observable<Song> {
        let formData = new FormData()
        formData.append("cover", cover)

        return this.http.put<Song>(`${environment.BASE_SERVER_URL}api/songs/${id}/change-cover`, formData)
    }
}
