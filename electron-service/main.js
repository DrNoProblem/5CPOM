const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Crée la fenêtre du navigateur.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  // et chargez le index.html de l'application.
  win.loadFile('../front-service/build/index.html');
}

app.whenReady().then(createWindow);
