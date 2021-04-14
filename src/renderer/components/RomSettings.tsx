import * as React from "react";
import { NavBar } from "./NavBar";
import { GeneralSettings } from "./GeneralSettings";
import { PartySettings } from "./PartySettings";
import { JobSettings } from "./JobSettings";
import { ItemSettings } from "./ItemSettings";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const RomSettings = () => {
  const [state, setState] = React.useState("noRom");

  api.receive("FileName-Change", function (msg: any) {
    console.log("rom loaded");
    setState("General");
  });

  switch (state) {
    case "noRom": {
      return (
        <div className="div-RomSettings">
          <h1>no Rom loaded</h1>
        </div>
      );
    }
    case "General": {
      return (
        <div className="div-RomSettings">
          <NavBar state={state} callback={setState} />
          <GeneralSettings />
        </div>
      );
    }
    case "Party": {
      return (
        <div className="div-RomSettings">
          <NavBar state={state} callback={setState} />
          <PartySettings />
        </div>
      );
    }
    case "Jobs": {
      return (
        <div className="div-RomSettings">
          <NavBar state={state} callback={setState} />
          <JobSettings />
        </div>
      );
    }
    case "Items": {
      return (
        <div className="div-RomSettings">
          <NavBar state={state} callback={setState} />
          <ItemSettings />
        </div>
      );
    }
    default: {
      return (
        <div className="div-RomSettings">
          <NavBar state={state} callback={setState} />
          ERROR!
        </div>
      );
    }
  }
};

export default RomSettings;
