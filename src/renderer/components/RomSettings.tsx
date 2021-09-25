import * as React from "react";
import { NavBar } from "./NavBar";
import { GeneralSettings } from "./GeneralSettings";
import { MissionSettings } from "./MissionSettings";
import { PartySettings } from "./PartySettings";
import { JobSettings } from "./JobSettings";
import { ItemLog } from "./ItemLog";
import { useRandomizer } from "./RandomizerProvider";
import MissionLog from "./MissionLog";
import AbilitySettings from "./AbilitySettings";

export const RomSettings = () => {
  const state = useRandomizer();

  let { romLoaded, currentPage } = state.generalSettings;

  let loadedPage = <> </>;
  switch (currentPage) {
    case "general":
      loadedPage = <GeneralSettings />;
      break;
    case "missions":
      loadedPage = <MissionSettings />;
      break;
    case "party":
      loadedPage = <PartySettings />;
      break;
    case "jobs":
      loadedPage = <JobSettings />;
      break;
    case "abilities":
      loadedPage = <AbilitySettings />;
      break;
    case "item Log":
      loadedPage = <ItemLog />;
      break;
    case "mission Log":
      loadedPage = <MissionLog />;
      break;
  }

  return (
    <>
      {!romLoaded && <div className="div-RomSettings">No Rom Loaded!</div>}
      {romLoaded && (
        <div className="div-RomSettings">
          <NavBar />
          {loadedPage}
        </div>
      )}
    </>
  );
};

export default RomSettings;
