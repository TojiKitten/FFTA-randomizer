import * as React from "react";

const remote = require('electron').remote;
const {dialog} = remote

export class FileSaver extends React.Component {
  constructor(probs: any) {
    super(probs);
  }

  render() {
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
            });
          }}
        >
          Save Rom
        </button>
      </div>
    );
  }
}
