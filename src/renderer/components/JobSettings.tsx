import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";
import { JobLite } from "_/main/ffta/DataWrapper/FFTAJob";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const JobSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { jobSettings } = state;
  const {
    jobRequirements,
    randomizeJobEquipment,
    randomizedWeaponsAmount,
    randomizeResistances,
    randomizedArmorAmount,
  } = jobSettings;

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

  const [jobsLite, setJobsLite] = React.useState(new Array<JobLite>());

  React.useEffect(() => {
    api.receive("get-fftaData", (parms: any) => {
      setJobsLite(parms.jobs);
    });
    api.send("request-fftaData", {
      jobs: true,
    });
    return () => api.remove("get-fftaData");
  }, []);

  const [resistanceHelpTexts, setResistanceHelpTexts] = React.useState([
    [""],
    [""],
    [""],
    [""],
    [""],
  ]);
  React.useEffect(() => {
    let newResistTexts: Array<Array<string>> = [];
    // Create new text for each job[0] and push it to resist texts
    const jobSamples = [
      jobsLite.find((job) => job.race === "human"),
      jobsLite.find((job) => job.race === "bangaa"),
      jobsLite.find((job) => job.race === "nuMou"),
      jobsLite.find((job) => job.race === "viera"),
      jobsLite.find((job) => job.race === "moogle"),
    ];

    jobSamples.forEach((sample) => {
      newResistTexts.push([
        `Fire: ${sample?.fireResist}`,
        `Wind: ${sample?.windResist}`,
        `Earth: ${sample?.earthResist}`,
        `Water: ${sample?.waterResist}`,
        `Ice: ${sample?.iceResist}`,
        `Thunder: ${sample?.thunderResist}`,
        `Holy: ${sample?.holyResist}`,
        `Dark: ${sample?.darkResist}`,
      ]);
    });

    setResistanceHelpTexts(newResistTexts);
  }, [jobsLite]);

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
          <label htmlFor="randomizeJobEquipment">Randomize Job Equipment</label>
          <input
            type="checkbox"
            id="randomizeJobEquipment"
            checked={randomizeJobEquipment}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { randomizeJobEquipment: event.target.checked },
              });
            }}
          />
          <div className="help-text">
            When enabled, randomizes weapon types each job can equip.
          </div>
        </div>
        {randomizeJobEquipment && (
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

        {randomizeJobEquipment && (
          <div className="jobOption has-help-text">
            <label htmlFor="randomizedArmorAmount">
              Randomize Job Armor Amount
            </label>
            <input
              type="number"
              id="randomizedArmorAmount"
              value={randomizedArmorAmount}
              min={1}
              onChange={(event) => {
                dispatch({
                  type: "jobSettings",
                  option: { randomizedArmorAmount: event.target.value },
                });
              }}
            />
            <div className="help-text">
              The number of armor types each job can equip.
            </div>
          </div>
        )}
        <div className="jobOption has-help-text">
          <label htmlFor="randomizeResistances">
            Randomize Race Resistances
          </label>
          <input
            type="checkbox"
            id="randomizeResistances"
            checked={randomizeResistances}
            onChange={(event) => {
              dispatch({
                type: "jobSettings",
                option: { randomizeResistances: event.target.checked },
              });
            }}
          />
          <div className="help-text">
            When enabled, randomizes elemental resistances for every race. 2
            elements will be "Weak" and 2 elements will be "Half".
          </div>
        </div>
      </div>
      {toggledJobs.map((raceJobs: ToggledJobs, i) => {
        return (
          <div key={raceJobs.raceName} className="jobList">
            <h3>{raceJobs.raceName}</h3>
            <ul>
              {resistanceHelpTexts[i].map((resist) => (
                <li>{resist}</li>
              ))}
            </ul>
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
