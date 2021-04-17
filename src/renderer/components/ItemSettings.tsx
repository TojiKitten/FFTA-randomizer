import * as React from "react";

interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const ItemSettings = ({globalState, callback}:props) => {
  let shopItems = globalState.find(element => element.setting==="shopitems")!;
  return (
    <div>
      shop Items:
      <select value={shopItems.value} onChange={(event) => {
        callback(shopItems.setting, event.target.value);
      }
      }>
        <option value="default">Default</option>
        <option value="limited">Limited</option>
        <option value="random">Random</option>
        <option value="all">All</option>
        <option value="none">None</option>
      </select>
    </div>
  );
};

export default ItemSettings;
