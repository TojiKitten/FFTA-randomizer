/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import "_public/style.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { FileOpener } from "./components/FileOpener";
import { FileSaver } from "./components/FileSaver";
import { ipcRenderer } from "electron/renderer";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

let filePath = "no file loaded";

ReactDOM.render(
  <div className="app">
    <h1>FFTA Randomizer</h1>
    <br />
    <div>
      <FileOpener id="opener-button" />
      <label id="opener-label" htmlFor="opener-button">
        {filePath}
      </label>
    </div>
    <div>
      <FileSaver />
    </div>
  </div>,
  document.getElementById("app")
);

interface filenameChange {
  filepath: string;
}

api.receive("FileName-Change", function (msg: filenameChange) {
  filePath = msg.filepath;
  ReactDOM.render(
    <span>
      {filePath}
    </span>,
    document.getElementById("opener-label")
    );
});
