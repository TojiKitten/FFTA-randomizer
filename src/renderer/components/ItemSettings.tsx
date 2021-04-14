import * as React from "react";

export const ItemSettings = () => {
  return (
    <div>
      shop Items:
      <select name="shopitems" id="shopitems">
        <option value="Default">Default</option>
        <option value="Limited">Limited</option>
        <option value="Random">Random</option>
        <option value="All">All</option>
        <option value="None">None</option>
      </select>
    </div>
  );
};

export default ItemSettings;
