import * as React from "react";
import { Config, Job } from "../utils/types";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const JobSettings = ({ globalState, callback }: props) => {
  let jobRequirements = globalState.find((element) => element.setting === "jobRequirements")!;
  let abilities = globalState.find((element) => element.setting === "abilities")!;
  let mpRegen = globalState.find((element) => element.setting === "mpRegen")!;

  // @ts-ignore
  let jobMap: Map<string, Array<Job>> = globalState.find((element) => element.setting === "jobMap")!.value;

  const jobChange = (event: any, race: string, jobs: Array<Job>) => {
    jobMap.get(race)!.find((element: any) => element.name == event.target.id)!.enabled = !jobMap
      .get(race)!
      .find((element: any) => element.name == event.target.id)!.enabled;

    callback({ setting: "jobMap", value: jobMap });
  };

  const setJobList = (jobs: Array<Job>, race: string): Array<JSX.Element> => {
    let list = Array<JSX.Element>();
    jobs.forEach((element: Job) => {
      list.push(
        <>
          <input
            type="checkbox"
            id={element.name}
            key={element.name + race}
            checked={element.enabled}
            onChange={(event) => jobChange(event, race, jobs)}
          />
          <label>{element.name}</label>
          <br />
        </>
      );
    });
    return list;
  };

  let humanJobList = setJobList(jobMap.get("human")!, "human");
  let bangaaJobList = setJobList(jobMap.get("bangaa")!, "bangaa");
  let nuMouJobList = setJobList(jobMap.get("nuMou")!, "nuMou");
  let vieraJobList = setJobList(jobMap.get("viera")!, "viera");
  let moogleJobList = setJobList(jobMap.get("moogle")!, "moogle");

  return (
    <div>
      <div className="jobList">
        Options <br />
        job Requirements:
        <select
          value={String(jobRequirements.value)}
          onChange={(element) => {
            callback({ setting: jobRequirements.setting, value: element.target.value });
          }}>
          <option value="normal">Normal</option>
          <option value="unlocked">All Unlocked</option>
          <option value="locked">All Locked</option>
        </select>
        <br />
        abilities:
        <select
          value={String(abilities.value)}
          onChange={(element) => {
            callback({ setting: abilities.setting, value: element.target.value });
          }}>
          <option value="normal">Normal</option>
          <option value="random">Random</option>
          <option value="shuffled">Shuffled</option>
        </select>
        <br />
        MP Regen:
        <select
          value={String(mpRegen.value)}
          onChange={(element) => {
            callback({ setting: mpRegen.setting, value: element.target.value });
          }}>
          <option value="normal">Normal</option>
          <option value="precentage">Percentage</option>
        </select>
      </div>
      <div className="jobList">
        Human
        <br />
        {humanJobList}
      </div>
      <div className="jobList">
        Bangaa
        <br />
        {bangaaJobList}
      </div>
      <div className="jobList">
        Nu Mou
        <br />
        {nuMouJobList}
      </div>
      <div className="jobList">
        Viera
        <br />
        {vieraJobList}
      </div>
      <div className="jobList">
        Moogle
        <br />
        {moogleJobList}
      </div>
    </div>
  );
};
export default JobSettings;
