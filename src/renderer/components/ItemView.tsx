import * as React from "react";

export const ItemView = (props: any) => {
  console.log(props.raceAbilitiesLite);
  return (
    <div>
      {props.itemLite.displayName}
      <ul>
        <li>Buy: {props.itemLite.buyPrice}</li>
        <li>Sell: {props.itemLite.sellPrice}</li>
        {props.itemLite.itemAbilities.map((iter: any, id: number) => {
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
              {job.displayName + " - "}
              {ability.displayName}
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default ItemView;
