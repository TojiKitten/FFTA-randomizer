import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

type unitProp = {
  name: string;
  raceChangeable: boolean;
  race: string;
  job: string;
  rngEquip: boolean;
  level: number;
  masteredAbilities: number;
  masterType: string;
};

export const PartyMember = (unit: unitProp) => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  const jobList: Array<string> = ["Random"];
  if (unit.race != "random") {
    state.jobSettings[
      unit.race as "human" | "bangaa" | "viera" | "nuMou" | "moogle"
    ].forEach((job) => {
      if (job.enabled) jobList.push(job.jobName);
    });
  }

  return (
    <div key={unit.name} className="partyMember">
      <h3 className="partyMemberOption">{unit.name}</h3>
      {unit.raceChangeable && (
        <div className="partyMemberOption">
          <label htmlFor={`Race_Selector${unit.name}`}>Race</label>
          <select
            id={`Race_Selector${unit.name}`}
            value={unit.race}
            onChange={(event) => {
              dispatch({
                type: "partySettings",
                option: {
                  partyMembers: state.partySettings.partyMembers.map((member) =>
                    member.name == unit.name
                      ? { ...member, race: event.target.value, job: "random" }
                      : { ...member }
                  ),
                },
              });
            }}
          >
            <option value="random">Random</option>
            <option value="human">Human</option>
            <option value="moogle">Moogle</option>
            <option value="viera">Viera</option>
            <option value="bangaa">Bangaa</option>
            <option value="nuMou">Nu Mou</option>
          </select>
        </div>
      )}

      <div className="partyMemberOption">
        <label htmlFor={`Job_Selector${unit.name}`}>Job</label>
        <select
          id={`Job_Selector${unit.name}`}
          value={unit.job}
          onChange={(event) => {
            dispatch({
              type: "partySettings",
              option: {
                partyMembers: state.partySettings.partyMembers.map((member) =>
                  member.name == unit.name
                    ? { ...member, job: event.target.value }
                    : { ...member }
                ),
              },
            });
          }}
        >
          {jobList.map((jobName) => (
            <option
              value={
                jobName[0].toLowerCase() + jobName.substr(1).replaceAll(" ", "")
              }
            >
              {jobName}
            </option>
          ))}
        </select>
      </div>

      <div className="partyMemberOption">
        <label htmlFor={`Random_Equip${unit.name}`}>Randomize Equipment</label>
        <input
          id={`Random_Equip${unit.name}`}
          type="checkbox"
          checked={unit.rngEquip}
          onChange={(event) =>
            dispatch({
              type: "partySettings",
              option: {
                partyMembers: state.partySettings.partyMembers.map((member) =>
                  member.name == unit.name
                    ? { ...member, rngEquip: event.target.checked }
                    : { ...member }
                ),
              },
            })
          }
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
          onChange={(event) =>
            dispatch({
              type: "partySettings",
              option: {
                partyMembers: state.partySettings.partyMembers.map((member) =>
                  member.name == unit.name
                    ? { ...member, level: parseInt(event.target.value) }
                    : { ...member }
                ),
              },
            })
          }
        ></input>
      </div>
      <div className="partyMemberOption">
        <label htmlFor={`AbilityMasteryType${unit.name}`}>
          Ability Mastery Type
        </label>
        <select
          id={`Ability_Mastery_Type_Selector${unit.name}`}
          value={unit.masterType}
          onChange={(event) => {
            dispatch({
              type: "partySettings",
              option: {
                partyMembers: state.partySettings.partyMembers.map((member) =>
                  member.name == unit.name
                    ? { ...member, masterType: event.target.value }
                    : { ...member }
                ),
              },
            });
          }}
        >
          <option value="abilities">Number of Abilities</option>
          <option value="jobs">Number of Jobs</option>
        </select>
      </div>
      <div className="partyMemberOption">
        <label htmlFor={`Abilities${unit.name}`}>Number Mastered</label>
        <input
          id={`Abilities${unit.name}`}
          type="number"
          min="0"
          value={unit.masteredAbilities}
          onChange={(event) =>
            dispatch({
              type: "partySettings",
              option: {
                partyMembers: state.partySettings.partyMembers.map((member) =>
                  member.name == unit.name
                    ? {
                        ...member,
                        masteredAbilities: parseInt(event.target.value),
                      }
                    : { ...member }
                ),
              },
            })
          }
        ></input>
      </div>
    </div>
  );
};

export default PartyMember;
