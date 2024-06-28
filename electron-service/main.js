const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

if (process.env.NODE_ENV !== "production") {
  try {
    require("electron-reload")(__dirname);
  } catch (err) {
    console.error("electron-reload is only required in development mode.");
  }
}

function createWindow() {
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    icon: path.join(__dirname, "./logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  win.setMenuBarVisibility(false);

  win.loadFile("../front-service/build/index.html");
}

function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd });

    process.stdout.on("data", (data) => {
      console.log(`[stdout] ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`[stderr] ${data}`);
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function installDependencies(cwd) {
  return runCommand("npm install", cwd);
}

app.whenReady().then(async () => {
  try {
    installDependencies(path.join(__dirname, "../general-service"));
    runCommand("npm run prod", path.join(__dirname, "../general-service"));

    installDependencies(path.join(__dirname, "../user-service"));
    runCommand("npm run prod", path.join(__dirname, "../user-service"));

    createWindow();
  } catch (error) {
    console.error("Failed to start services:", error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
