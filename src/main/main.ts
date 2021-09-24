/**
 * Entry point of the Election app.
 */
import * as path from "path";
import * as url from "url";
import { BrowserWindow, app, dialog } from "electron";
import * as fs from "fs";

import "../../public/favicon-96x96.png";
import { FFTAData } from "./ffta/FFTAData";
import * as RandomizerOptions from "./Randomizer";

const ipc = require("electron").ipcMain;

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "FFTA Randomizer",
    icon: path.join(__dirname, "public", "favicon-96x96.png"),
    width: 900,
    height: 680,
    maxHeight: 2160,
    maxWidth: 3840,
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

  // Hide the menu if the app is packaged
  app.isPackaged ? mainWindow.removeMenu() : false;

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
let randomizerOptions: RandomizerOptions.iRandomizerOptions = {};

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
    //check if Rom is Valid
    if (filecontent.subarray(0xac, 0xb0).toString() !== "AFXE") {
      dialog.showErrorBox("error Loading", "Rom is not supported!");
      return;
    }
    fftaData = new FFTAData(filecontent);
    mainWindow!.webContents.send("FileName-Change", { filepath: filepath });
    mainWindow!.webContents.send("get-seed", { seed: fftaData.getSeed() });
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
  savefile(choosenfiles, options);
});

ipc.on("request-fftaData", (event, parms: any) => {
  if (fftaData) {
    mainWindow!.webContents.send("get-fftaData", {
      items: parms.items
        ? fftaData.items.map((item) => item.getItemInfo())
        : {},
      jobs: parms.jobs
        ? Array.from(fftaData.jobs.values())
            .map((raceJobs) => raceJobs.map((job) => job.getJobInfo()))
            .flat()
        : {},
      raceAbilities: parms.raceAbilities
        ? Array.from(fftaData.raceAbilities.entries())
            .map((entry) =>
              entry[1].map((raceAbility, num) => ({
                race: entry[0],
                displayName: raceAbility.displayName,
                id: num,
              }))
            )
            .flat()
        : {},
      abilityData: parms.abilityData
        ? {
            abilityNames: [
              ...new Set(
                Array.from(fftaData.raceAbilities.entries())
                  .map((entry) =>
                    entry[1].map((raceAbility, num) => raceAbility.displayName)
                  )
                  .flat()
              ),
            ],
          }
        : {},
    });
  }
});

function savefile(filepath: any, payload: any) {
  //check if dialog got cancelled
  if (filepath) {
    RandomizerOptions.randomizeFFTA(fftaData, payload);
    fftaData.writeData();
    fftaData.runForcedHacks(payload);
    fs.writeFileSync(filepath, fftaData.rom, null);
    mainWindow!.webContents.send("File-saved", { filepath: filepath });
  }
}

//
//Save settings
//
ipc.on("save-settings", function (event, options: any) {
  const choosenfiles = dialog.showSaveDialogSync(mainWindow!, {
    title: "Save Config",
    filters: [
      { name: "json", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  SaveSettings(choosenfiles, options);
});

function SaveSettings(filepath: any, payload: any) {
  //check if dialog got cancelled
  if (filepath) {
    let data: String = JSON.stringify(payload);
    fs.writeFileSync(filepath, data, null);
  }
}

//
//load settings
//
ipc.on("load-settings", function (event, options: any) {
  const choosenfiles = dialog.showOpenDialogSync(mainWindow!, {
    title: "Open Config",
    properties: ["openFile"],
    filters: [
      { name: "json", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  openSettings(choosenfiles);
});

function openSettings(files: any) {
  //look if actually selected a file
  if (files) {
    let filepath = files[0];
    let settings = JSON.parse(fs.readFileSync(filepath, "utf-8"));
    mainWindow!.webContents.send("get-settings", { newConfig: settings });
  }
}

ipc.on("save-mission-log", function (event, options: any) {
  SaveSettings(
    path.join(process.resourcesPath, "db", "MissionData.json"),
    options.payload
  );
});

ipc.on("load-mission-log", (event, parms: any) => {
  if (fftaData) {
    const fileContents = fs.readFileSync(
      path.join(process.resourcesPath, "db", "MissionData.json"),
      "utf-8"
    );

    mainWindow!.webContents.send("get-missions", {
      payload: JSON.parse(fileContents),
      pathway: process.resourcesPath,
    });
  }
});
