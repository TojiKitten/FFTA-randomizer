import * as React from "react";
import { FFTAAbility } from "_/main/ffta/DataWrapper/FFTAAbility";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

// @ts-ignore
const { api } = window;

export const JobSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { abilitySettings } = state;
  const { abilities, bannedAbilities } = abilitySettings;
  const [abilityNames, setAbilityNames] = React.useState(new Array<string>());
  const [stateBannedAbilities, setStateBannedAbilities] = React.useState(
    new Array<string>()
  );
  const [searchName, setSearchName] = React.useState("");

  React.useEffect(() => {
    api.receive("get-fftaData", (parms: any) => {
      setAbilityNames(parms.abilityData.abilityNames);
    });
    api.send("request-fftaData", {
      abilityData: true,
    });
    return () => api.remove("get-fftaData");
  }, [state.generalSettings.isRandomized]);

  React.useEffect(() => {
    setStateBannedAbilities(bannedAbilities);
  }, [bannedAbilities]);

  const [abilityHelp, setAbilityHelp] = React.useState("");
  React.useEffect(() => {
    switch (abilities) {
      case "normal":
        setAbilityHelp("Abilities are unchanged.");
        break;
      case "random":
        setAbilityHelp(
          "Abilities are randomized with no limitations. Some abilities may not appear at all. Example: Double Sword may not appear at all."
        );
        break;
      case "shuffled":
        setAbilityHelp(
          "Abilities are randomized and are limited to the same number of occurrences as they normally appear. Example: Absolutely one job will learn Double Sword."
        );
        break;
    }
  }, [abilities]);

  return (
    <div className="jobMenu">
      <div className="jobOptions">
        <div className="jobOption has-help-text">
          <label htmlFor="abilities">Abilities</label>
          <select
            id="abilities"
            value={abilities}
            onChange={(event) => {
              dispatch({
                type: "abilitySettings",
                option: { abilities: event.target.value },
              });
            }}
          >
            <option value="normal">Normal</option>
            <option value="random">Random</option>
            <option value="shuffled">Shuffled</option>
          </select>
          <div className="help-text">{abilityHelp}</div>
        </div>
      </div>
      <div className="jobOptions">
        <label htmlFor="abilitySearch">Search</label>
        <input
          id="abilitySearch"
          type="search"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
        ></input>
      </div>
      {abilityNames
        ?.filter((ability: string) =>
          ability.toLowerCase().includes(searchName.toLowerCase())
        )
        .map((ability: string, index: number) => {
          return (
            <div key={ability + index.toString()} className="jobListJob">
              <label htmlFor={ability + index.toString()}>{ability}</label>
              <input
                type="checkbox"
                id={ability + index.toString()}
                checked={!stateBannedAbilities.includes(ability)}
                onChange={(event) =>
                  dispatch({
                    type: "abilitySettings",
                    option: {
                      bannedAbilities: event.target.checked
                        ? [...bannedAbilities].filter(
                            (bannedAbilityID) => bannedAbilityID != ability
                          )
                        : [...bannedAbilities, ability],
                    },
                  })
                }
              />
            </div>
          );
        })}
    </div>
  );
};
export default JobSettings;
