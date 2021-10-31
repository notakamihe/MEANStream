import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from './../../models/User';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
    public user : User

    constructor(private http : HttpClient) { 
        this.initializeData()
    }

    initializeData () {
        let data : Object = JSON.parse(localStorage.getItem("user"))

        if (data) {
            this.user = new User(data)
        }
    }

    isLoggedIn () : boolean {
        return Boolean(this.user)
    }

    isAuthorized (id : string) : boolean {
        return this.user._id == id
    }
}
