import * as React from "react";
import { Config, Job, Unit } from "../utils/types";

type props = {
  unit: Unit;
  jobList: Array<Job>;
  callback: (event: any,setting: string, unit: Unit) => void;
  
};

export const PartyMember = ({ unit, callback, jobList }: props) => {
  let raceChanger = <br />;
  if (unit.raceChangeable) {
    raceChanger = (
      <>
        Race:
        <select value={unit.race} onChange={(event) => callback(event, "race", unit)}>
          <option value="human">Human</option>
          <option value="moogle">Moogle</option>
          <option value="viera">Viera</option>
          <option value="bangaa">Bangaa</option>
          <option value="nuMou">Nu Mou</option>
        </select>
        <br />
      </>
    );
  }

  let jobOptions = [];
  jobOptions.push(<option value="random">Random</option>);
  jobList.forEach((element) => {
    if (element.enabled) {
      jobOptions.push(<option value={element.name}>{element.name}</option>);
    }
  });

  return (
    <div className="partyMember">
      {unit.name}
      <br />
      {raceChanger}
      Job:
      <select value={unit.job} onChange={(event) => callback(event, "job", unit)}>
        {jobOptions}
      </select>
      <br />
      <input type="checkbox" checked={unit.rngEquip} onChange={(event) => callback(event, "rngEquip", unit)} />
      <label>randomize Equipment</label>
      <br />
      Level:
      <input type="number" min="1" max="50" value={unit.level} onChange={(event) => callback(event, "level", unit)}></input>
      <br />
      Mastered Abilities:
      <input type="number" min="0" value={unit.masteredAbilities} onChange={(event) => callback(event, "masteredAbilities", unit)}></input>
    </div>
  );
};

export default PartyMember;
