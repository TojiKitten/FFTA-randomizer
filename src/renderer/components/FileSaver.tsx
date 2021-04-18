import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;


interface props{
  globalState: Array<{setting: string, value: any}>;
}

export const FileSaver = ({globalState}:props) => {
  return (
    <button
      className="file-button"
      onClick={() => {
        api.send("set-settings", globalState);
        api.send("save-file-dialog", "null");
      }}
    >
      Save Rom
    </button>
  );
};

export default FileSaver;
