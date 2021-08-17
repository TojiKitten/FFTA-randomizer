import * as React from "react";
import { NavBar } from "./NavBar";
import { GeneralSettings } from "./GeneralSettings";
import { PartySettings } from "./PartySettings";
import { JobSettings } from "./JobSettings";
import { ItemSettings } from "./ItemSettings";
import { Logbook } from "./Logbook";
import { Config } from "../utils/types";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const RomSettings = ({ globalState, callback }: props) => {
  let isRom = globalState.find(
    (element) => element.setting === "romLoaded"
  )!.value;
  let state = globalState.find((element) => element.setting === "currentPage");

  if (!isRom) {
    return <div className="div-RomSettings">No Rom Loaded!</div>;
  }

  switch (state!.value) {
    case "general": {
      return (
        <div className="div-RomSettings">
          <NavBar />
          <GeneralSettings />
        </div>
      );
    }
    case "party": {
      return (
        <div className="div-RomSettings">
          <NavBar />
          <PartySettings globalState={globalState} callback={callback} />
        </div>
      );
    }
    case "jobs": {
      return (
        <div className="div-RomSettings">
          <NavBar />
          <JobSettings globalState={globalState} callback={callback} />
        </div>
      );
    }
    case "items": {
      return (
        <div className="div-RomSettings">
          <NavBar />
          <ItemSettings globalState={globalState} callback={callback} />
        </div>
      );
    }
    case "logbook": {
      return (
        <div className="div-RomSettings">
          <NavBar />
          <Logbook globalState={globalState} callback={callback} />
        </div>
      );
    }
    default: {
      return (
        <div className="div-RomSettings">
          <NavBar />
          ERROR!
        </div>
      );
    }
  }
};

export default RomSettings;
