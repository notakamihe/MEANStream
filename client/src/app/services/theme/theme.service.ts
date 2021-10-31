import { Injectable, Inject, EventEmitter } from '@angular/core';

@Injectable()
export class ThemeService {
  public darkMode : boolean

  constructor() {
    const theme = localStorage.getItem("theme")
    this.darkMode = theme === "dark";
    document.body.setAttribute("data-theme", theme)
  }

  setDarkMode(darkMode : boolean) {
    const theme = darkMode ? "dark" : ""
    localStorage.setItem("theme", theme)
    this.darkMode = darkMode
    document.body.setAttribute("data-theme", theme)
  }
}
