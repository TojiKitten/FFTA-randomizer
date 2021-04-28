import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const SeetingsLoader = () => {
  return (
    <button
      onClick={() => {
        api.send("load-settings", "null");
      }}
    >
      Load Config
    </button>
  );
};

export default SeetingsLoader;
