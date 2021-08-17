import * as React from "react";
import { Config, Job } from "../utils/types";
import { useRandomizer } from "./RandomizerProvider";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<Config>;
}

export const RomSaver = () => {
  const state = useRandomizer();
  return (
    <button
      className="fileButton"
      onClick={() => {
        // api.send("set-settings", state);
        api.send("save-file-dialog", state);
      }}
    >
      Save Rom
    </button>
  );
};

export default RomSaver;
