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

  let humanJobList = Array<JSX.Element>();
  let bangaaJobList = Array<JSX.Element>();
  let nuMouJobList = Array<JSX.Element>();
  let vieraJobList = Array<JSX.Element>();
  let moogleJobList = Array<JSX.Element>();

  const humanJobChange = (event: any) => {
    console.log(event.target.id);
    humanJobs.value.find((element: any) => element.name == event.target.id).enabled = !humanJobs.value.find((element: any) => element.name == event.target.id).enabled
    callback(humanJobs.setting, humanJobs.value)
  }
  const bangaaJobChange = (event: any) => {
    console.log(event.target.id);
    bangaaJobs.value.find((element: any) => element.name == event.target.id).enabled = !bangaaJobs.value.find((element: any) => element.name == event.target.id).enabled
    callback(bangaaJobs.setting, bangaaJobs.value)
  }
  const nuMouJobChange = (event: any) => {
    console.log(event.target.id);
    nuMouJobs.value.find((element: any) => element.name == event.target.id).enabled = !nuMouJobs.value.find((element: any) => element.name == event.target.id).enabled
    callback(nuMouJobs.setting, nuMouJobs.value)
  }
  const vieraJobChange = (event: any) => {
    console.log(event.target.id);
    vieraJobs.value.find((element: any) => element.name == event.target.id).enabled = !vieraJobs.value.find((element: any) => element.name == event.target.id).enabled
    callback(vieraJobs.setting, vieraJobs.value)
  }
  const moogleJobChange = (event: any) => {
    console.log(event.target.id);
    moogleJobs.value.find((element: any) => element.name == event.target.id).enabled = !moogleJobs.value.find((element: any) => element.name == event.target.id).enabled
    callback(moogleJobs.setting, moogleJobs.value)
  }

  humanJobs.value.forEach((element: any) => {
    humanJobList.push(
      <>
        <input type="checkbox" id={element.name} checked={element.enabled} onChange={humanJobChange}/>
        <label>{element.name}</label>
        <br />
      </>
    );
  });

  bangaaJobs.value.forEach((element: any) => {
    bangaaJobList.push(
      <>
        <input type="checkbox" id={element.name} checked={element.enabled} onChange={bangaaJobChange}/>
        <label>{element.name}</label>
        <br />
      </>
    );
  });

  nuMouJobs.value.forEach((element: any) => {
    nuMouJobList.push(
      <>
        <input type="checkbox" id={element.name} checked={element.enabled} onChange={nuMouJobChange}/>
        <label>{element.name}</label>
        <br />
      </>
    );
  });

  vieraJobs.value.forEach((element: any) => {
    vieraJobList.push(
      <>
        <input type="checkbox" id={element.name} checked={element.enabled} onChange={vieraJobChange}/>
        <label>{element.name}</label>
        <br />
      </>
    );
  });

  moogleJobs.value.forEach((element: any) => {
    moogleJobList.push(
      <>
        <input type="checkbox" id={element.name} checked={element.enabled} onChange={moogleJobChange}/>
        <label>{element.name}</label>
        <br />
      </>
    );
  });

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
