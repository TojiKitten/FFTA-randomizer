import { concat } from "lodash";
import * as React from "react";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";
import { Config } from "../utils/types";
import RaceAbilityView from "./RaceAbilityView";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const Logbook = ({ globalState, callback }: props) => {
  const [raceAbilities, setRaceAbilities] = React.useState(
    new Map<string, Array<FFTARaceAbility>>()
  );
  const [abilityIndex, setAbilityIndex] = React.useState(0);
  const [raceString, setRaceString] = React.useState("human");

  const raceStrings = ["human", "bangaa", "nuMou", "viera", "moogle"];

  const handleClick = () => {
    console.log(raceAbilities);
  };

  React.useEffect(() => {
    api.receive("get-fftaData", (parms: any) => {
      setRaceAbilities(parms.abilities);
      setAbilityIndex(1);
    });
    api.send("get-ability", { abilityNumber: 0 });
    return () => api.remove("get-fftaData");
  }, []);

  return (
    <div>
      <input
        type="number"
        value={abilityIndex}
        onChange={(event) => setAbilityIndex(parseInt(event.target.value))}
      ></input>
      <select onChange={(event) => setRaceString(event.target.value)}>
        {raceStrings.map((item) => {
          return <option value={item}>{item}</option>;
        })}
      </select>
      <button onClick={handleClick}>Search</button>
      {abilityIndex > 0 &&
        raceAbilities
          .get(raceString)!
          .map((ability, index) => <RaceAbilityView ability={ability} />)}
    </div>
  );
};

export default Logbook;
