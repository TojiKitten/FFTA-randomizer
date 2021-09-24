import * as React from "react";
import { useRandomizerUpdate } from "./RandomizerProvider";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const RomLoader = () => {
  const dispatch = useRandomizerUpdate();

  React.useEffect(() => {
    api.receive("FileName-Change", (msg: any) => {
      dispatch({
        type: "generalSettings",
        option: { romLoaded: true },
      });
      dispatch({
        type: "generalSettings",
        option: { isRandomized: false },
      });
    });
    return () => {
      api.remove("FileName-Change");
    };
  }, []);

  return (
    <button
      className="fileButton"
      onClick={() => {
        api.send("open-file-dialog", "null");
      }}
    >
      Open Rom
    </button>
  );
};

export default RomLoader;
