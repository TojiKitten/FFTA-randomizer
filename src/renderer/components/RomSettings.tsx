import * as React from "react";
import { NavBar } from "./NavBar";
import { GeneralSettings } from "./GeneralSettings";
import { PartySettings } from "./PartySettings";
import { JobSettings } from "./JobSettings";
import { ItemSettings } from "./ItemSettings";



interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const RomSettings = ({globalState, callback}: props) => {
  let isRom = JSON.parse(globalState.find(element => element.setting === "romLoaded")!.value);
  let state = globalState.find(element => element.setting === "currentPage")

  if (!isRom){
    return (
      <div className="div-RomSettings">
        No Rom Loaded!
      </div>
    );
  }
  
  switch (state!.value) {
    case "General": {
      return (
        <div className="div-RomSettings">
          <NavBar active="General" callback={callback} />
          <GeneralSettings globalState={globalState} callback={callback}/>
        </div>
      );
    }
    case "Party": {
      return (
        <div className="div-RomSettings">
          <NavBar active="Party" callback={callback} />
          <PartySettings globalState={globalState} callback={callback}/>
        </div>
      );
    }
    case "Jobs": {
      return (
        <div className="div-RomSettings">
          <NavBar active="Jobs" callback={callback} />
          <JobSettings globalState={globalState} callback={callback}/>
        </div>
      );
    }
    case "Items": {
      return (
        <div className="div-RomSettings">
          <NavBar active="Items" callback={callback} />
          <ItemSettings globalState={globalState} callback={callback}/>
        </div>
      );
    }
    default: {
      return (
        <div className="div-RomSettings">
          <NavBar active="" callback={callback} />
          ERROR!
        </div>
      );
    }
  }
};

export default RomSettings;
