import * as React from "react";
const remote = require("electron").remote;
const { dialog } = remote;
const ipc = require("electron").ipcRenderer;

export const FileOpener = () => (
  <div>
    <button
      onClick={() => {
        dialog
          .showOpenDialog({
            title: "Open Rom",
            properties: ["openFile"],
            filters: [
              { name: "GBA ROM", extensions: ["gba"] },
              { name: "All Files", extensions: ["*"] },
            ],
          })
          .then((data) => {
            ipc.send("open-File", data);
          });
      }}
    >
      Open Rom
    </button>
  </div>
);

export default FileOpener;
