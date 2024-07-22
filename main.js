const { app, BrowserWindow } = require("electron");
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const { fetch } = require('cross-fetch') // required 'fetch'
var fs = require("fs");
const configPath = "./yt-config.json";
const defaultConfig = { // Steam deck default resolution isnt supported
    "width": "1280",
    "height": "720"
};
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
}
const config = require(configPath);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript  object is garbage collected.
let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: config.width,
    height: config.height,
    icon: "icon.png",
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: false,
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  const blocker = await ElectronBlocker.fromLists(fetch, [
    "https://cdn.jsdelivr.net/gh/uBlockOrigin/uAssetsCDN@main/thirdparties/easyprivacy.txt",
    "https://cdn.jsdelivr.net/gh/uBlockOrigin/uAssetsCDN@main/filters/filters.min.txt",
    "https://cdn.statically.io/gh/uBlockOrigin/uAssetsCDN/main/filters/badware.min.txt",
    "https://ublockorigin.pages.dev/filters/privacy.min.txt",
    "https://ublockorigin.pages.dev/filters/quick-fixes.min.txt",
    "https://ublockorigin.pages.dev/filters/unbreak.min.txt",
    "https://cdn.jsdelivr.net/gh/uBlockOrigin/uAssetsCDN@main/thirdparties/easylist.txt"
  ]);
  
  
  // and load the index.html of the app.
  win.loadFile("index.html");

  win.maximize();

  blocker.enableBlockingInSession(win.webContents.session);


  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
