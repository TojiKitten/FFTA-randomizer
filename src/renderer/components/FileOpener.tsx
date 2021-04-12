import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
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
