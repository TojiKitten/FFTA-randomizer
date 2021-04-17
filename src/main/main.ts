/**
 * Entry point of the Election app.
 */
import * as path from "path";
import * as url from "url";
import { BrowserWindow, app, dialog } from "electron";
import * as fs from "fs";

import "../../public/favicon-96x96.png";
import { FFTAData } from "./ffta/FFTAData";
import * as RandomizerOptions from "./ffta/RandomizerOptions";

const ipc = require("electron").ipcMain;

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "FFTA Randomizer",
    icon: path.join(__dirname, "public", "favicon-96x96.png"),
    width: 900,
    height: 680,
    maxHeight: 1080,
    maxWidth: 1920,
    minHeight: 400,
    minWidth: 400,
    backgroundColor: "#FFFFFF",
    //resizable: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.bundle.js"),
    },
  });

  //mainWindow.removeMenu();
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
let fftaData: FFTAData;
let randomizerOptions: RandomizerOptions.iRandomizerOptions = RandomizerOptions.defaultRandomizer();
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
  if (files) {
    let filepath = files[0];
    let filecontent = fs.readFileSync(filepath);
    fftaData = new FFTAData(filecontent);
    mainWindow!.webContents.send("FileName-Change", { filepath: filepath });
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
  if (filepath) {
    RandomizerOptions.randomizeFFTA(fftaData, randomizerOptions);
    fftaData.writeData();
    fs.writeFileSync(filepath, fftaData.rom, null);
  }
}

//
// get and set settings from frontend
//

ipc.on("set-settings", function (event, options: Array<{ setting: string; value: any }>) {
  console.log(options);
  options.forEach((element) => {
    switch (element.setting) {
      case "romLoaded":
      case "currentPage":
      case "isRandomized":
      case "randomizerSeed":
        //just here to not trigger default. frontend settings
        break;
      case "storyEnemyLevels":
        break;
      case "storyEnemyLevelsScale":
        break;
      case "cutscenes":
        randomizerOptions.cutscenes = element.value;
        break;
      case "missionRewards":
        break;
      case "apBoost":
        break;
      case "laws":
        break;
      case "startingGold":
        break;
      case "frostyMageBoost":
        break;
      case "missionRewards":
        break;
      case "noJudgeTurn":
        break;
      default:
        throw new Error("unknown randomizer setting: " + element.setting);
    }
  });
});
