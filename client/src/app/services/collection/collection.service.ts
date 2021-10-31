import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from './../../models/Collection';
import environment from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
    constructor(private http : HttpClient) { }

    addCollectionSong (id : string, songId : string) : Observable<Collection> {
        return this.http.put<Collection>(`${environment.BASE_SERVER_URL}api/collections/${id}/add-song/${songId}`, {})
    }

    createCollection (category : string, description : string, isPrivate : boolean, releaseDate : string, title : string, user : string) : Observable<Collection> {
        return this.http.post<Collection>(`${environment.BASE_SERVER_URL}api/collections`, {
            category,
            description,
            private: isPrivate,
            releaseDate,
            title,
            user
        })
    }

    deleteCollection (id : string) : Observable<any> {
        return this.http.delete<any>(`${environment.BASE_SERVER_URL}api/collections/${id}`)
    }

    getCollectionBySlug (username : string, slug : string) : Observable<Collection> {
        return this.http.get<Collection>(`${environment.BASE_SERVER_URL}api/collections/${username}/${slug}`)
    }

    getCollections () : Observable<Collection[]> {
        return this.http.get<Collection[]>(`${environment.BASE_SERVER_URL}api/collections`)
    }

    getCollectionsByUserId (id : string) : Observable<Collection[]> {
        return this.http.get<Collection[]>(`${environment.BASE_SERVER_URL}api/collections/user/${id}`)
    }

    getCollectionsBySongId (id : string) : Observable<Collection[]> {
        return this.http.get<Collection[]>(`${environment.BASE_SERVER_URL}api/collections/song/${id}`)
    }

    removeCollectionSong (id : string, songId : string) : Observable<Collection> {
        return this.http.put<Collection>(`${environment.BASE_SERVER_URL}api/collections/${id}/remove-song/${songId}`, {})
    }

    updateCollection (id : string, category : string, description : string, isPrivate : boolean, releaseDate : string, title : string) : Observable<Collection> {
        return this.http.put<Collection>(`${environment.BASE_SERVER_URL}api/collections/${id}`, {
            category,
            description,
            private: isPrivate,
            releaseDate,
            title
        })
    }

    updateCollectionCover (id : string, file : File) {
        let formData = new FormData()

        formData.append("cover", file)

        return this.http.put<Collection>(`${environment.BASE_SERVER_URL}api/collections/${id}/change-cover`, formData)
    }

    updateCollectionSongs (id : string, songs : string[]) : Observable<Collection> {
        return this.http.put<Collection>(`${environment.BASE_SERVER_URL}api/collections/${id}/songs`, {
            songs
        })
    }
}
