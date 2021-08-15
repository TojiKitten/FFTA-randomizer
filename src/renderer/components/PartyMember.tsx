import * as React from "react";
import { Config, Job, Unit } from "../utils/types";

type props = {
  unit: Unit;
  jobList: Array<Job>;
  callback: (event: any, setting: string, unit: Unit) => void;
};

export const PartyMember = ({ unit, callback, jobList }: props) => {
  let raceChanger = <></>;
  if (unit.raceChangeable) {
    raceChanger = (
      <div className="partyMemberOption">
        <label htmlFor={`Race_Selector${unit.name}`}>Race</label>
        <select
          id={`Race_Selector${unit.name}`}
          value={unit.race}
          onChange={(event) => callback(event, "race", unit)}
        >
          <option value="random">Random</option>
          <option value="human">Human</option>
          <option value="moogle">Moogle</option>
          <option value="viera">Viera</option>
          <option value="bangaa">Bangaa</option>
          <option value="nuMou">Nu Mou</option>
        </select>
      </div>
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
    <div key={unit.name} className="partyMember">
      <h3 className="partyMemberOption">{unit.name}</h3>
      {raceChanger}
      <div className="partyMemberOption">
        <label htmlFor={`Job_Selector${unit.name}`}>Job</label>
        <select
          id={`Job_Selector${unit.name}`}
          value={unit.job}
          onChange={(event) => callback(event, "job", unit)}
        >
          {jobOptions}
        </select>
      </div>
      <div className="partyMemberOption">
        <label htmlFor={`Random_Equip${unit.name}`}>Randomize Equipment</label>
        <input
          id={`Random_Equip${unit.name}`}
          type="checkbox"
          checked={unit.rngEquip}
          onChange={(event) => callback(event, "rngEquip", unit)}
        />
      </div>
      <div className="partyMemberOption">
        <label htmlFor={`Level${unit.name}`}>Level</label>
        <input
          id={`Level${unit.name}`}
          type="number"
          min="1"
          max="50"
          value={unit.level}
          onChange={(event) => callback(event, "level", unit)}
        ></input>
      </div>
      <div className="partyMemberOption">
        <label htmlFor={`Abilities${unit.name}`}>Mastered Abilities</label>
        <input
          id={`Abilities${unit.name}`}
          type="number"
          min="0"
          value={unit.masteredAbilities}
          onChange={(event) => callback(event, "masteredAbilities", unit)}
        ></input>
      </div>
    </div>
  );
};

export default PartyMember;
