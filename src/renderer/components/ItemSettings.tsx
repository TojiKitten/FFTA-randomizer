import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const ItemSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { shopSettings } = state;
  const { shopItems, randomChance } = shopSettings;

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

  return (
    <div>
      <div className="has-help-text">
        <label htmlFor="shopItemsOption">Shop Items</label>
        <select
          id="shopItemsOption"
          value={shopItems}
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
                type: "shopSettings",
                option: { randomChance: parseInt(event.target.value) },
              });
            }}
          />
          {randomChance}% of items in shop.
        </div>
      )}
    </div>
  );
};

export default ItemSettings;
