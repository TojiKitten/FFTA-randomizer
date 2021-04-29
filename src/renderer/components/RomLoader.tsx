import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const RomLoader = () => {
  return (
    <button
      onClick={() => {
        api.send("open-file-dialog", "null");
      }}>
      Open Rom
    </button>
  );
};

export default RomLoader;
