import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const {api} = window;

let id: any
export const FileOpener = (props: any) => {
  id = props.id;
  return (
      <button
        onClick={() => {
          api.send("open-file-dialog", "null");
        }}
      >
        Open Rom
      </button>
  );
};

export default FileOpener;
