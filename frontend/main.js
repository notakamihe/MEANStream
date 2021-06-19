const { app, BrowserWindow, shell, } = require('electron')
const url = require("url");
const path = require("path");

let win

function createWindow() {
    console.log("Starting app...");

    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    win.setTitle("MEAN Streaming & Player")

    win.loadURL(`file://${__dirname}/dist/frontend2/index.html`)

    win.on('closed', function () {
        win = null
    })

    win.webContents.on("did-fail-load", (e) => {
        win.loadURL(`file://${__dirname}/dist/frontend2/index.html`)
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (win === null) createWindow()
})