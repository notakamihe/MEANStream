import { Router } from "@angular/router"
import { ElectronService } from "ngx-electron"
import environment from "./../../environments/environment"
import { Comment } from '../models/Comment'
import { Song } from '../models/Song'
import { CurrentSongService } from "../services/current-song/current-song.service"
import { CurrentUserService } from "../services/current-user/current-user.service"
import { UserService } from "../services/user/user.service"
import moment from "moment"

export function changeSong (service : CurrentSongService, songs : Song[]) {
    localStorage.setItem("songs", JSON.stringify(songs))
    service.change(songs)
}

export function deleteUser (electronService : ElectronService, userService : UserService, router : Router, currentUserService : CurrentUserService, currentSongService : CurrentSongService) {
    const options = {
        title: "Delete profile",
        buttons: ["Yes", "Cancel"],
        message: "Are you sure you want to delete your profile? All songs, collections, and comments with also be removed and you can never them."
    }

    const num = electronService.remote.dialog.showMessageBoxSync(null, options)        

    if (num == 0) {
        userService.deleteUser(currentUserService.user._id).subscribe(() => {
        }, (error : ErrorEvent) => {
            logOut(currentUserService, router, currentSongService)
        })
    } 
}

export function getFilename (str : string) : string {
    if (!str)
        return

    const split = str.split(/[\\\/]/)
    return split[split.length - 1]
}

export function getServerFileUrl(url: string): string {
    return `${environment.BASE_FILE_URL}${getFilename(url)}`.split('\\').join('/')
}

export function getYear(date: Date | string): number {
    if (date instanceof Date)
    return date.getFullYear()
    
    return new Date(date).getFullYear()
}

export function includesIgnoreCase (target : string, value : string) : boolean {
    return target.toLowerCase().includes(value.toLowerCase())
}

export function isComment(obj: any) {
    return obj instanceof Comment
}

export function isSong(obj: any) {
    return obj instanceof Song
}

export function logOut (currentUserService : CurrentUserService, router : Router, currentSongService : CurrentSongService) {
    localStorage.removeItem("user")
    localStorage.removeItem("songs")
    currentUserService.user = null
    currentSongService.clear()
    router.navigateByUrl("/")
}

export function toMonthShort(month: number | string): string {
    const monthsOfTheYear = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return monthsOfTheYear[typeof month == "string" ? parseInt(month) : month]
}

export function toMonthShortNatural(month: number | string): string {
    const monthsOfTheYear = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return monthsOfTheYear[typeof month == "string" ? parseInt(month) - 1 : month - 1]
}