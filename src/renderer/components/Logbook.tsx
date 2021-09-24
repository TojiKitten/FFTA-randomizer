import * as React from "react";
import { ItemLite } from "_/main/ffta/DataWrapper/FFTAItem";
import { JobLite } from "_/main/ffta/DataWrapper/FFTAJob";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";
import { Config } from "../utils/types";
import ItemView from "./ItemView";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const Logbook = () => {
  const [itemsLite, setItemNames] = React.useState(new Array<ItemLite>());
  const [jobsLite, setJobsLite] = React.useState(new Array<JobLite>());
  const [raceAbilities, setRaceAbilities] = React.useState(
    new Array<FFTARaceAbility>()
  );
  const [searchName, setSearchName] = React.useState("");

  React.useEffect(() => {
    api.receive("get-fftaData", (parms: any) => {
      setItemNames(parms.items);
      setJobsLite(parms.jobs);
      setRaceAbilities(parms.raceAbilities);
    });
    api.send("request-fftaData", {
      items: true,
      jobs: true,
      raceAbilities: true,
    });
    return () => api.remove("get-fftaData");
  }, []);

  return (
    <div>
      <form>
        <label htmlFor="logbookSearch">Search</label>
        <input
          id="logbookSearch"
          type="text"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
        ></input>
      </form>
      <div className="logbook">
        {raceAbilities.length > 0 &&
          itemsLite
            .filter((item) =>
              item.displayName.toLowerCase().includes(searchName.toLowerCase())
            )
            .map((iter, id) => {
              return (
                <ItemView
                  key={id}
                  itemLite={iter}
                  jobsLite={jobsLite}
                  raceAbilitiesLite={raceAbilities}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Logbook;
