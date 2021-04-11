import * as React from "react";
const remote = require("electron").remote;
const { dialog } = remote;
const ipc = require('electron').ipcRenderer

export const FileSaver = () => {
  return (
    <div>
      <button
        onClick={() => {
          dialog.showSaveDialog({
            title: "Save Rom",
            filters: [
              { name: "GBA ROM", extensions: ["gba"] },
              { name: "All Files", extensions: ["*"] },
            ],
          }).then((data) => {
            ipc.send("save-File", data);
          });
        }}
      >
        Save Rom
      </button>
    </div>
  );
};

export default FileSaver;
