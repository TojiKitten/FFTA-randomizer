import * as React from "react";
import { Config } from "../utils/types";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const RandomizerSettings = ({ globalState, callback }: props) => {
  let seed = Number(globalState.find(
    (element) => element.setting === "randomizerSeed"
  )!.value);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.target.elements.seed.value);
    callback({setting: "randomizerSeed", value: String(event.target.elements.seed.value)});
    event.target.reset();
  };

  return (
    <div className="div-RandoSettings">
      <form onSubmit={handleSubmit}>
        <input name="seed" type="number" defaultValue={seed} />
        <input type="submit" value="set Seed" />
      </form>
    </div>
  );
};

export default RandomizerSettings;
