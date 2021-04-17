import * as React from "react";
import PartyMember from "./PartyMember";

type Unit = {
  name: string;
  raceChangable: boolean;
  race: string;
  job: string;
  rngEquip: boolean;
  level: number;
  masteredAbilities: number;
};

interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const PartySettings = ({ globalState, callback }: props) => {
  let partyMember = globalState.find((element) => element.setting === "partyMember")!;

  let humanJobs = globalState.find((element) => element.setting === "humanJobs")!;
  let bangaaJobs = globalState.find((element) => element.setting === "bangaaJobs")!;
  let nuMouJobs = globalState.find((element) => element.setting === "nuMouJobs")!;
  let vieraJobs = globalState.find((element) => element.setting === "vieraJobs")!;
  let moogleJobs = globalState.find((element) => element.setting === "moogleJobs")!;

  let partyMemberList = Array<JSX.Element>();

  const changeProperty = (event: any, prop: string, unit: Unit) => {
    if (prop === "rngEquip") {
      partyMember.value.find((element: Unit) => element.name === unit.name)[prop] = !partyMember.value.find(
        (element: Unit) => element.name === unit.name
      )[prop];
    } else {
      if (prop === "race") {
        partyMember.value.find((element: Unit) => element.name === unit.name)["job"] = "random";
      }
      partyMember.value.find((element: Unit) => element.name === unit.name)[prop] = event.target.value;
    }
    callback(partyMember.setting, partyMember.value);
  };

  partyMember.value.forEach((element: Unit) => {
    let jobs = Array<{ name: string; enabled: boolean }>();
    switch (element.race) {
      case "human":
        jobs = humanJobs.value;
        break;
      case "bangaa":
        jobs = bangaaJobs.value;
        break;
      case "nuMou":
        jobs = nuMouJobs.value;
        break;
      case "viera":
        jobs = vieraJobs.value;
        break;
      case "moogle":
        jobs = moogleJobs.value;
        break;
    }
    partyMemberList.push(<PartyMember unit={element} jobList={jobs} callback={changeProperty} />);
  });

  return <div>{partyMemberList}</div>;
};

export default PartySettings;
