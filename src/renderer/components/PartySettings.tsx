import * as React from "react";
import { Config, Job, Unit } from "../utils/types";
import PartyMember from "./PartyMember";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const PartySettings = ({ globalState, callback }: props) => {
  let partyMember = globalState.find((element) => element.setting === "partyMember")! as {
    setting: string;
    value: Array<Unit>;
  };

  let humanJobs = globalState.find((element) => element.setting === "humanJobs")! as {
    setting: string;
    value: Array<Job>;
  };
  let bangaaJobs = globalState.find((element) => element.setting === "bangaaJobs")! as {
    setting: string;
    value: Array<Job>;
  };
  let nuMouJobs = globalState.find((element) => element.setting === "nuMouJobs")! as {
    setting: string;
    value: Array<Job>;
  };
  let vieraJobs = globalState.find((element) => element.setting === "vieraJobs")! as {
    setting: string;
    value: Array<Job>;
  };
  let moogleJobs = globalState.find((element) => element.setting === "moogleJobs")! as {
    setting: string;
    value: Array<Job>;
  };

  let partyMemberList = Array<JSX.Element>();

  const changeProperty = (event: any, setting: string, unit: Unit) => {
    if (setting === "rngEquip") {
      partyMember.value.find((element: Unit) => element.name === unit.name)![setting] = !partyMember.value.find(
        (element: Unit) => element.name === unit.name
      )![setting];
    } else {
      if (setting === "race") {
        partyMember.value.find((element: Unit) => element.name === unit.name)!["job"] = "random";
      }
      //line breakes because index stuff i have no idea <.< TODO!!!!
      // @ts-ignore
      partyMember.value.find((element: Unit) => element.name === unit.name)![setting] = event.target.value;
    }
    callback(partyMember);
  };

  partyMember.value.forEach((element: Unit) => {
    let jobs = Array<Job>();
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
