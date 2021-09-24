import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const ItemView = (props: any) => {
  const { memory } = props.itemLite;
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { itemSettings } = state;
  const { bannedItems } = itemSettings;
  const [stateBannedItems, setStateBannedItems] = React.useState(
    new Array<number>()
  );
  React.useEffect(() => {
    setStateBannedItems(bannedItems);
  }, [bannedItems]);

  let sortedAbilities = props.itemLite.itemAbilities.sort(
    (first: any, second: any) => first.jobID - second.jobID
  );

  return (
    <div className="item-view">
      <h3>{props.itemLite.displayName}</h3>
      <div className="item-content">
        <label htmlFor={"allowed" + memory.toString()}>Allowed</label>
        <input
          type="checkbox"
          id={"allowed" + memory.toString()}
          checked={!stateBannedItems.includes(memory)}
          onChange={(event) => {
            dispatch({
              type: "itemSettings",
              option: {
                bannedItems: event.target.checked
                  ? [...bannedItems].filter(
                      (bannedItemMemory) => bannedItemMemory != memory
                    )
                  : [...bannedItems, memory],
              },
            });
          }}
        />
      </div>
      <div className="item-content">
        <ul>
          <li>Buy: {props.itemLite.buyPrice}</li>
          <li>Sell: {props.itemLite.sellPrice}</li>
          {sortedAbilities.length > 0 ? <li>Abilities</li> : null}
          <ul>
            {sortedAbilities.map((iter: any, id: number) => {
              let job = props.jobsLite.find(
                (item: any) => item.id == iter.jobID
              );
              let ability =
                job != undefined
                  ? props.raceAbilitiesLite.find(
                      (abil: any) =>
                        abil.race == job.race && abil.id == iter.abilityID - 1
                    )
                  : {};

              return job != undefined ? (
                <li key={id}>
                  {job.displayName +
                    " (" +
                    job.race[0].toUpperCase() +
                    ") - " +
                    ability.displayName}
                </li>
              ) : null;
            })}
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default ItemView;
