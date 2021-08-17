import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const JobSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  const toggledJobs = [
    { raceName: "Human", jobs: state.jobSettings.human },
    { raceName: "Bangaa", jobs: state.jobSettings.bangaa },
    { raceName: "Nu Mou", jobs: state.jobSettings.nuMou },
    { raceName: "Viera", jobs: state.jobSettings.viera },
    { raceName: "Moogle", jobs: state.jobSettings.moogle },
  ];
  type ToggledJobs = typeof toggledJobs[0];

  return (
    <div className="jobMenu">
      <div className="jobOptions">
        <div className="jobOption">
          <label htmlFor="jobRequirements">Job Requirements</label>
          <select
            id="jobRequirements"
            value={state.jobSettings.jobRequirements}
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
        </div>
        <div className="jobOption">
          <label htmlFor="abilities">Abilities</label>
          <select
            id="abilities"
            value={state.jobSettings.abilities}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { abilities: event.target.value },
              });
            }}
          >
            <option value="normal">Normal</option>
            <option value="random">Random</option>
            <option value="shuffled">Shuffled</option>
          </select>
        </div>
        <div className="jobOption">
          <label htmlFor="mpRegen">MP Regen</label>
          <select
            id="mpRegen"
            value={state.jobSettings.abilities}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { mpRegen: event.target.value },
              });
            }}
          >
            <option value="normal">Normal</option>
            <option value="precentage">Percentage</option>
          </select>
        </div>
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
