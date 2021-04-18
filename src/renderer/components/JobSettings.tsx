import * as React from "react";

interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const JobSettings = ({ globalState, callback }: props) => {
  let jobRequirements = globalState.find((element) => element.setting === "jobRequirements")!;
  let abilities = globalState.find((element) => element.setting === "abilities")!;
  let mpRegen = globalState.find((element) => element.setting === "mpRegen")!;

  let humanJobs = globalState.find((element) => element.setting === "humanJobs")!;
  let bangaaJobs = globalState.find((element) => element.setting === "bangaaJobs")!;
  let nuMouJobs = globalState.find((element) => element.setting === "nuMouJobs")!;
  let vieraJobs = globalState.find((element) => element.setting === "vieraJobs")!;
  let moogleJobs = globalState.find((element) => element.setting === "moogleJobs")!;

  const jobChange = (event: any, race: string) => {
    let jobs: { setting: string; value: any } = { setting: "null", value: "null" };
    switch (race) {
      case "human":
        jobs = humanJobs;
        break;
      case "bangaa":
        jobs = bangaaJobs;
        break;
      case "nuMou":
        jobs = nuMouJobs;
        break;
      case "viera":
        jobs = vieraJobs;
        break;
      case "moogle":
        jobs = moogleJobs;
        break;
    }

    jobs.value.find((element: any) => element.name == event.target.id).enabled = !jobs.value.find(
      (element: any) => element.name == event.target.id
    ).enabled;

    callback(jobs.setting, jobs.value);
  };

  const setJobList = (data: any, race: string): Array<JSX.Element> => {
    let list = Array<JSX.Element>();
    data.value.forEach((element: any) => {
      list.push(
        <>
          <input
            type="checkbox"
            id={element.name}
            checked={element.enabled}
            onChange={(event) => jobChange(event, race)}
          />
          <label>{element.name}</label>
          <br />
        </>
      );
    });
    return list;
  };

  let humanJobList = setJobList(humanJobs, "human");
  let bangaaJobList = setJobList(bangaaJobs, "bangaa");
  let nuMouJobList = setJobList(nuMouJobs, "nuMou");
  let vieraJobList = setJobList(vieraJobs, "viera");
  let moogleJobList = setJobList(moogleJobs, "moogle");
  return (
    <div>
      <div className="jobList">
        Options <br />
        job Requirements:
        <select
          value={jobRequirements.value}
          onChange={(element) => {
            callback(jobRequirements.setting, element.target.value);
          }}
        >
          <option value="normal">Normal</option>
          <option value="unlocked">All Unlocked</option>
          <option value="locked">All Locked</option>
        </select>
        <br />
        abilities:
        <select
          value={abilities.value}
          onChange={(element) => {
            callback(abilities.setting, element.target.value);
          }}
        >
          <option value="normal">Normal</option>
          <option value="random">Random</option>
          <option value="shuffled">Shuffled</option>
        </select>
        <br />
        MP Regen:
        <select
          value={mpRegen.value}
          onChange={(element) => {
            callback(mpRegen.setting, element.target.value);
          }}
        >
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
