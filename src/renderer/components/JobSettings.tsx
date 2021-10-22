import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const JobSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { jobSettings } = state;
  const { jobRequirements, randomizedJobWeapons, randomizedWeaponsAmount } =
    jobSettings;

  const toggledJobs = [
    { raceName: "Human", jobs: state.jobSettings.human },
    { raceName: "Bangaa", jobs: state.jobSettings.bangaa },
    { raceName: "Nu Mou", jobs: state.jobSettings.nuMou },
    { raceName: "Viera", jobs: state.jobSettings.viera },
    { raceName: "Moogle", jobs: state.jobSettings.moogle },
  ];
  type ToggledJobs = typeof toggledJobs[0];

  const [jobReqHelp, setJobReqHelp] = React.useState("");
  React.useEffect(() => {
    switch (jobRequirements) {
      case "normal":
        setJobReqHelp("Job requirements are unchanged.");
        break;
      case "unlocked":
        setJobReqHelp("Jobs have no requirements.");
        break;
      case "locked":
        setJobReqHelp("Jobs cannot be unlocked or changed.");
        break;
    }
  }, [jobRequirements]);

  return (
    <div className="jobMenu">
      <div className="jobOptions">
        <div className="jobOption has-help-text">
          <label htmlFor="jobRequirements">Job Requirements</label>
          <select
            id="jobRequirements"
            value={jobRequirements}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { jobRequirements: event.target.value },
              });
            }}
          >
            <option value="normal">Normal</option>
            <option value="unlocked">All Unlocked</option>
            <option value="locked">All Locked</option>
          </select>
          <div className="help-text">{jobReqHelp}</div>
        </div>
        <div className="jobOption has-help-text">
          <label htmlFor="randomizeJobWeapons">Randomize Job Weapons</label>
          <input
            type="checkbox"
            id="randomizeJobWeapons"
            checked={randomizedJobWeapons}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { randomizedJobWeapons: event.target.checked },
              });
            }}
          />
          <div className="help-text">
            When enabled, randomizes weapon types each job can equip.
          </div>
        </div>
        {randomizedJobWeapons && (
          <div className="jobOption has-help-text">
            <label htmlFor="randomizeWeaponAmount">
              Randomize Job Weapon Amount
            </label>
            <input
              type="number"
              id="randomizeWeaponAmount"
              value={randomizedWeaponsAmount}
              min={1}
              onChange={(event) => {
                dispatch({
                  type: "jobSettings",
                  option: { randomizedWeaponsAmount: event.target.value },
                });
              }}
            />
            <div className="help-text">
              The number of weapon types each job can equip.
            </div>
          </div>
        )}
      </div>
      {toggledJobs.map((raceJobs: ToggledJobs) => {
        return (
          <div key={raceJobs.raceName} className="jobList">
            <h3>{raceJobs.raceName}</h3>
            {raceJobs.jobs.map(
              (value: { jobName: string; enabled: boolean }) => (
                <div
                  key={value.jobName + raceJobs.raceName}
                  className="jobListJob"
                >
                  <label htmlFor={value.jobName + raceJobs.raceName}>
                    {value.jobName}
                  </label>
                  <input
                    type="checkbox"
                    id={value.jobName + raceJobs.raceName}
                    key={value.jobName + raceJobs.raceName}
                    checked={value.enabled}
                    onChange={(event) =>
                      dispatch({
                        type: "jobSettings",
                        option: {
                          [raceJobs.raceName[0].toLowerCase() +
                          raceJobs.raceName.substr(1).replaceAll(" ", "")]:
                            raceJobs.jobs.map(
                              (job: { jobName: string; enabled: boolean }) =>
                                job.jobName == value.jobName
                                  ? { ...job, enabled: event.target.checked }
                                  : { ...job }
                            ),
                        },
                      })
                    }
                  />
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};
export default JobSettings;
