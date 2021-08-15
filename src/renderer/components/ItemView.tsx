import * as React from "react";

export const ItemView = (props: any) => {
  let sortedAbilities = props.itemLite.itemAbilities.sort(
    (first: any, second: any) => first.jobID - second.jobID
  );

  return (
    <div className="item-view">
      <h3>{props.itemLite.displayName}</h3>
      <ul>
        <li>Buy: {props.itemLite.buyPrice}</li>
        <li>Sell: {props.itemLite.sellPrice}</li>
        {sortedAbilities.length > 0 ? <li>Abilities</li> : null}
        <ul>
          {sortedAbilities.map((iter: any, id: number) => {
            let job = props.jobsLite.find((item: any) => item.id == iter.jobID);
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
  );
};

export default ItemView;
