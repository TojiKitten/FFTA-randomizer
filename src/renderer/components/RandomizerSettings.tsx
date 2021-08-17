import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const RandomizerSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  return (
    <div className="div-RandoSettings">
      <label htmlFor="seed">Seed</label>
      <input
        id="seed"
        type="number"
        value={state.generalSettings.randomizerSeed}
        onChange={(event) =>
          dispatch({
            type: "generalSettings",
            option: { randomizerSeed: event.target.value },
          })
        }
      />
    </div>
  );
};

export default RandomizerSettings;
