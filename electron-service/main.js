const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname);

function createWindow () {
  // Crée la fenêtre du navigateur.
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    icon: path.join(__dirname, './logo.ico'),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  win.setMenuBarVisibility(false)

  // et chargez le index.html de l'application.
  win.loadFile('../front-service/build/index.html');
}

app.whenReady().then(createWindow);
