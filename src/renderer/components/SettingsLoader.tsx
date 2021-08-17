import * as React from "react";
import { useRandomizerUpdate, useRandomizer } from "./RandomizerProvider";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const SeetingsLoader = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  React.useEffect(() => {
    api.receive("get-settings", (msg: any) => {
      Object.keys(msg.newConfig).forEach((setting: string) => {
        dispatch({
          type: setting,
          option: { ...msg.newConfig[setting] },
        });
      });

      dispatch({
        type: "generalSettings",
        option: { currentPage: "general" },
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
        api.send("load-settings", "null");
      }}
    >
      Load Config
    </button>
  );
};

export default SeetingsLoader;
