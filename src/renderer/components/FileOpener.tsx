import * as React from "react";
import { ipcRenderer } from "electron";

export const FileOpener = () => {
  return (
    <div>
      <button
        onClick={() => {
          ipcRenderer.send("open-file-dialog");
        }}
      >
        Open Rom
      </button>
    </div>
  );
};

export default FileOpener;
