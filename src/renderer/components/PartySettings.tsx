import * as React from "react";
import { Config, Job, Unit } from "../utils/types";
import PartyMember from "./PartyMember";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const PartySettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  // let partyRngEnabled = globalState.find(
  //   (element) => element.setting === "partyRNGEnabled"
  // );

  // let partyMember = globalState.find(
  //   (element) => element.setting === "partyMember"
  // )! as {
  //   setting: string;
  //   value: Array<Unit>;
  // };

  // // @ts-ignore
  // let jobMap: Map<string, Array<Job>> = globalState.find(
  //   (element) => element.setting === "jobMap"
  // )!.value;

  // let partyMemberList = Array<JSX.Element>();

  // const changeProperty = (event: any, setting: string, unit: Unit) => {
  //   if (setting === "rngEquip") {
  //     partyMember.value.find((element: Unit) => element.name === unit.name)![
  //       setting
  //     ] = !partyMember.value.find(
  //       (element: Unit) => element.name === unit.name
  //     )![setting];
  //   } else {
  //     if (setting === "race") {
  //       partyMember.value.find((element: Unit) => element.name === unit.name)![
  //         "job"
  //       ] = "random";
  //     }
  //     //line breakes because index stuff i have no idea <.< TODO!!!!
  //     // @ts-ignore
  //     partyMember.value.find((element: Unit) => element.name === unit.name)![
  //       setting
  //     ] = event.target.value;
  //   }
  //   callback(partyMember);
  // };

  // partyMember.value.forEach((element: Unit) => {
  //   let jobs = Array<Job>();
  //   switch (element.race) {
  //     case "human":
  //       jobs = jobMap!.get("human")!;
  //       break;
  //     case "bangaa":
  //       jobs = jobMap.get("bangaa")!;
  //       break;
  //     case "nuMou":
  //       jobs = jobMap.get("nuMou")!;
  //       break;
  //     case "viera":
  //       jobs = jobMap.get("viera")!;
  //       break;
  //     case "moogle":
  //       jobs = jobMap.get("moogle")!;
  //       break;
  //   }
  //   if (Boolean(partyRngEnabled!.value)) {
  //     partyMemberList.push(
  //       <PartyMember unit={element} jobList={jobs} callback={changeProperty} />
  //     );
  //   }
  // });

  return (
    <div>
      <label htmlFor="enablePartyRandomization">
        Enable Party Randomization
      </label>
      <input
        id="enablePartyRandomization"
        type="checkbox"
        checked={state.partySettings.partyRNGEnabled}
        onChange={(event) => {
          dispatch({
            type: "partySettings",
            option: { partyRNGEnabled: event.target.checked },
          });
        }}
      />

      {state.partySettings.partyRNGEnabled && (
        <div className="partyList">
          {state.partySettings.partyMembers.map((member) => (
            <>
              <PartyMember {...member} />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartySettings;
