import * as React from "react";
import { Config } from "../utils/types";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const RandomizerSettings = ({ globalState, callback }: props) => {
  let seed = globalState.find(
    (element) => element.setting === "randomizerSeed"
  )!.value;

  const handleSubmit = (event: any) => {
    event.preventDefault();
    callback({
      setting: "randomizerSeed",
      value: String(event.target.elements.seed.value),
    });
    event.target.reset();
  };

  return (
    <div className="div-RandoSettings">
      <form onSubmit={handleSubmit}>
        <input name="seed" type="number" value={Number(seed)} onChange={(event) =>
          callback({setting:"randomizerSeed", value: event.target.value})
        }/>
        <input type="submit" value="set Seed" />
      </form>
    </div>
  );
};

export default RandomizerSettings;
