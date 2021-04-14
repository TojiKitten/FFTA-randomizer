import { ipcRenderer } from "electron/renderer";
import * as React from "react";

export const RandomizerSettings = () => {
  const [seed, setSeed] = React.useState(
    Math.trunc(Math.random() * 1000000000)
  );

  function setSeedHandler(event: any) {
    //TODO implement apiSend to backend
    event.preventDefault();
    setSeed(event.target.elements.message.value);
    event.target.reset();
  }

  function createRandomSeed(event: any) {
    let newSeed: number = Math.trunc(Math.random() * 1000000000);
    setSeed(newSeed);
  }

  return (
    <div className="div-RandoSettings">
      <form onSubmit={setSeedHandler}>
        <input name="Seed" type="text" defaultValue={seed} />
        <input type="submit" value="set Seed" />
      </form>
      <form onSubmit={createRandomSeed}>
        <input type="submit" value="random Seed" />
      </form>
    </div>
  );
};

export default RandomizerSettings;
