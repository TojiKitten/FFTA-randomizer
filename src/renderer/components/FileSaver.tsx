import * as React from "react";
import { ipcRenderer } from "electron";

export const FileSaver = () => {
  return (
    <div>
      <button
        onClick={() => {
          ipcRenderer.send("save-file-dialog");
        }}
      >
        Save Rom
      </button>
    </div>
  );
};

export default FileSaver;
