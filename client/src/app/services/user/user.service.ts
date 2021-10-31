import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from './../../models/User';
import environment from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    addFollower (id : string, followerId : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/add-follower/${followerId}`, {})
    }

    addFollowing (id : string, followingId : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/add-following/${followingId}`, {})
    }

    changePassword (id : string, password : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/change-password`, {
            password
        })
    }

    deleteUser (id : string) {
        return this.http.delete<User>(`${environment.BASE_SERVER_URL}api/users/${id}`)
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.BASE_SERVER_URL}api/users`)
    }

    getLikedByUserId(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${environment.BASE_SERVER_URL}api/users/${id}/liked`)
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${environment.BASE_SERVER_URL}api/users/${id}`)
    }

    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${environment.BASE_SERVER_URL}api/users/username/${username}`)
    }

    getUserFromToken(token: string): Observable<User> {
        return this.http.get<User>(`${environment.BASE_SERVER_URL}api/users/user`, {
            headers: {
                "x-access-token": token
            }
        })
    }

    logIn(usernameOrEmail: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.BASE_SERVER_URL}api/users/login`, {
            usernameOrEmail,
            password
        });
    }

    privateAll (id : string) : Observable<any> {
        return this.http.put<any>(`${environment.BASE_SERVER_URL}api/users/${id}/private-all`, {})
    }

    register(username: string, email: string, description: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.BASE_SERVER_URL}api/users/register`, {
            username,
            email,
            description,
            password
        });
    }

    removeAllLikesComments (id : string) : Observable<any> {
        return this.http.put<any>(`${environment.BASE_SERVER_URL}api/users/${id}/remove-all-likes-comments`, {})
    }

    removeFollower (id : string, followerId : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/remove-follower/${followerId}`, {})
    }

    removeFollowing (id : string, followingId : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/remove-following/${followingId}`, {})
    }

    updateUser (id : string, username : string, email : string, description : string) : Observable<User> {
        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}`, {
            username,
            email,
            description
        })
    }

    updateUserPfp(id: string, file: File): Observable<User> {
        let formData = new FormData()

        formData.append("pfp", file)

        return this.http.put<User>(`${environment.BASE_SERVER_URL}api/users/${id}/change-pfp`, formData);
    }
}
