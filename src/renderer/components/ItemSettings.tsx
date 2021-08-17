import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const ItemSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  return (
    <div>
      <label htmlFor="shopItemsOption">Shop Items</label>
      <select
        id="shopItemsOption"
        value={state.shopSettings.shopItems}
        onChange={(event) => {
          dispatch({
            type: "shopSettings",
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
    </div>
  );
};

export default ItemSettings;
