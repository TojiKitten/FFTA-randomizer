import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const {api} = window;

export const FileSaver = () => {
  return (
    <div>
      <button
        onClick={() => {
          api.send("save-file-dialog", "null");
        }}
      >
        Save Rom
      </button>
    </div>
  );
};

export default FileSaver;
