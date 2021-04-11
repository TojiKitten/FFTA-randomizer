import React from "react";
const remote = require("electron").remote;
const { dialog } = remote;

export const FileOpener = () => {
  return (
    <div>
      <button
        onClick={() => {
          dialog.showOpenDialog({
            title: "Open Rom",
            properties: ["openFile"],
            filters: [
              { name: "GBA ROM", extensions: ["gba"] },
              { name: "All Files", extensions: ["*"] },
            ],
          });
        }}
      >
        Open Rom
      </button>
    </div>
  );
};

export default FileOpener;
