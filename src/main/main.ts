/**
 * Entry point of the Election app.
 */
import * as path from "path";
import * as url from "url";
import { BrowserWindow, app, dialog } from "electron";
import * as fs from "fs";

const ipc = require("electron").ipcMain;

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "FFTA Randomizer",
    width: 900,
    height: 680,
    maxHeight: 1080,
    maxWidth: 1920,
    minHeight: 400,
    minWidth: 400,
    backgroundColor: "#FFFFFF",
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.bundle.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow
    .loadURL(
      url.format({
        pathname: path.join(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true,
      })
    )
    .finally(() => {
      /* no action */
    });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//TODO filecontent placeholder
let filecontent: Uint8Array;

//
//Open File Handling
//

ipc.on("open-file-dialog", function (event, options: any) {
  const choosenfiles = dialog.showOpenDialogSync(mainWindow!, {
    title: "Open Rom",
    properties: ["openFile"],
    filters: [
      { name: "GBA ROM", extensions: ["gba"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  openfile(choosenfiles);
});

function openfile(files: any) {
  //look if actually selected a file
  if (files !== undefined) {
    let filepath = files[0];
    //console.log(filepath)
    filecontent = fs.readFileSync(filepath);
    //console.log(filecontent);
  }
}

//
//Save File Handling
//

ipc.on("save-file-dialog", function (event, options: any) {
  const choosenfiles = dialog.showSaveDialogSync(mainWindow!, {
    title: "Save Rom",
    filters: [
      { name: "GBA ROM", extensions: ["gba"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  savefile(choosenfiles);
});

function savefile(filepath: any) {
  //check if dialog got cancelled
  if (filepath !== undefined) {
    fs.writeFileSync(filepath, filecontent, null);
    //console.log("file: " + filepath + " written");
  }
}
