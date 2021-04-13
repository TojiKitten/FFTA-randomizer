import * as React from "react";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const RomSettings = () => {
  const [state, setState] = React.useState("noRom");

  api.receive("FileName-Change", function (msg: any) {
    console.log("rom loaded");
    setState("RomLoaded")
  });


  if (state === "noRom") {
    return <div className="div-RomSettings">no Rom loaded</div>;
  }
  return <div className="div-RomSettings">Rom loaded!</div>;
};

export default RomSettings;
