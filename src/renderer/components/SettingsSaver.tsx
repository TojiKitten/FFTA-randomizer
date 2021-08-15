import * as React from "react";
import { Config, Job } from "../utils/types";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<Config>;
}

export const SettingsSaver = ({ globalState }: props) => {
  return (
    <button
      className="fileButton"
      onClick={() => {
        api.send("set-settings", globalState);
        api.send("save-settings", "null");
      }}
    >
      Save Config
    </button>
  );
};

export default SettingsSaver;
