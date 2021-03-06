import * as React from "react";
import { Config, Job } from "../utils/types";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<Config>;
}

export const RomSaver = () => {
  const state = useRandomizer();
  const dispatch = useRandomizerUpdate();

  React.useEffect(() => {
    api.receive("File-saved", (msg: any) => {
      dispatch({
        type: "generalSettings",
        option: { isRandomized: true },
      });
    });
    return () => {
      api.remove("File-saved");
    };
  }, []);

  return (
    <button
      className="fileButton"
      onClick={(event) => {
        event.preventDefault();
        api.send("save-file-dialog", state);
      }}
    >
      Save Rom
    </button>
  );
};

export default RomSaver;
