import * as React from "react";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";

interface RaceAbilityStruct {
  ability: FFTARaceAbility;
}

export const Logbook = (props: RaceAbilityStruct) => {
  const raceAbility = props.ability;

  return <div>{raceAbility.displayName}</div>;
};

export default Logbook;
