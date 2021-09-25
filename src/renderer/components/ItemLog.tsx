import * as React from "react";
import { ItemLite } from "_/main/ffta/DataWrapper/FFTAItem";
import { JobLite } from "_/main/ffta/DataWrapper/FFTAJob";
import { FFTARaceAbility } from "_/main/ffta/DataWrapper/FFTARaceAbility";
import { Config } from "../utils/types";
import ItemView from "./ItemView";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const ItemLog = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { itemSettings } = state;
  const { shopItems, randomChance } = itemSettings;

  const [shopItemHelp, setShopItemHelp] = React.useState("");
  React.useEffect(() => {
    switch (shopItems) {
      case "default":
        setShopItemHelp("Shop items are unchanged.");
        break;
      case "limited":
        setShopItemHelp(
          "Each item type will have 4 items appear in shop. Prices are adjusted based on stats of the item."
        );
        break;
      case "random":
        setShopItemHelp(
          "Items have a chance to appear in shop. Prices are adjusted based on stats of the item."
        );
        break;
      case "all":
        setShopItemHelp("All items appear in shop. No price adjustments.");
        break;
      case "none":
        setShopItemHelp(
          "Equipment does not appear in shops. The shop only sells default consumables."
        );
        break;
    }
  }, [shopItems]);

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
      <div className="has-help-text">
        <label htmlFor="shopItemsOption">Shop Items</label>
        <select
          id="shopItemsOption"
          value={shopItems}
          onChange={(event) => {
            dispatch({
              type: "itemSettings",
              option: { shopItems: event.target.value },
            });
          }}
        >
          <option value="default">Default</option>
          <option value="limited">Limited</option>
          <option value="random">Random</option>
          <option value="all">All</option>
          <option value="none">None</option>
        </select>
        <div className="help-text">{shopItemHelp}</div>
      </div>
      {shopItems === "random" && (
        <div>
          <label htmlFor="randomChance">Percentage of Items</label>
          <input
            id="randomChance"
            type="Range"
            min="0"
            max="100"
            value={randomChance.toString()}
            onChange={(event) => {
              dispatch({
                type: "itemSettings",
                option: { randomChance: parseInt(event.target.value) },
              });
            }}
          />
          {randomChance}% of items in shop.
        </div>
      )}
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

export default ItemLog;
