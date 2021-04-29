import * as React from "react";
import { Config, Job } from "../utils/types";

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const ItemSettings = ({ globalState, callback }: props) => {
  let shopItems = globalState.find((element) => element.setting === "shopitems")!;
  return (
    <div>
      shop Items:
      <select
        value={String(shopItems.value)}
        onChange={(event) => {
          callback({ setting: shopItems.setting, value: event.target.value });
        }}>
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
