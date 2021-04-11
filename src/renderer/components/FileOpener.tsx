import * as React from "react";
// @ts-ignore:2339
const {api} = window;

export const FileOpener = () => {
  return (
    <div>
      <button
        onClick={() => {
          api.send("open-file-dialog", "null");
        }}
      >
        Open Rom
      </button>
    </div>
  );
};

export default FileOpener;
