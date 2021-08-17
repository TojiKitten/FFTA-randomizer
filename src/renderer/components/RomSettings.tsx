import * as React from "react";
import { NavBar } from "./NavBar";
import { GeneralSettings } from "./GeneralSettings";
import { PartySettings } from "./PartySettings";
import { JobSettings } from "./JobSettings";
import { ItemSettings } from "./ItemSettings";
import { Logbook } from "./Logbook";
import { Config } from "../utils/types";
import { useRandomizer } from "./RandomizerProvider";

export const RomSettings = () => {
  const state = useRandomizer();

  let { romLoaded, currentPage } = state.generalSettings;
  //let state = globalState.find((element) => element.setting === "currentPage");

  return (
    <>
      {!romLoaded && <div className="div-RomSettings">No Rom Loaded!</div>}
      {romLoaded && currentPage == "general" && (
        <div className="div-RomSettings">
          <NavBar />
          <GeneralSettings />
        </div>
      )}
      {romLoaded && currentPage == "logbook" && (
        <div className="div-RomSettings">
          <NavBar />
          <Logbook />
        </div>
      )}
    </>
  );

  /*
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
    }*/
};

export default RomSettings;
