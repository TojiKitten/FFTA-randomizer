import { concat } from "lodash";
import * as React from "react";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";
import { Config } from "../utils/types";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const Logbook = ({ globalState, callback }: props) => {
  const [raceAbilities, setRaceAbilities] = React.useState([]);
  const searchAbility = () => {
    api.send("get-ability", { abilityNumber: 0 });
  };

  api.receive("get-fftaData", (parms: any) => {
    let humanAbilities = parms.abilities.get("human");
    setRaceAbilities(humanAbilities);
    console.log(raceAbilities);
  });

  return (
    <div>
      <input type="number"></input>
      <button onClick={searchAbility}>Search</button>
    </div>
  );
};

export default Logbook;
