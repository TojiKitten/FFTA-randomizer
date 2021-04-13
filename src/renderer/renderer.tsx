// Import the styles here to process them with webpack
import "_public/style.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { FileOpener } from "./components/FileOpener";
import { FileSaver } from "./components/FileSaver";
import {RandomizerSettings} from "./components/RandomizerSettings"
import {RomSettings} from "./components/RomSettings"

ReactDOM.render(
  <div className="app">
    <h1>FFTA Randomizer</h1>
    <br />
    <div className="div-fileButtons">
      <div className="centering-wrapper">
        <FileOpener />
        <FileSaver />
      </div>
    </div>

    <RandomizerSettings />
    <RomSettings />
  </div>,
  document.getElementById("app")
);