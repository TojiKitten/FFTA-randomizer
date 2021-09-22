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
      <button
        onClick={(event) =>
          dispatch({
            type: "generalSettings",
            option: {
              randomizerSeed: parseInt(
                new Date().getFullYear().toString() +
                  (new Date().getMonth() + 1).toString().padStart(2, "0") +
                  new Date().getUTCDate().toString().padStart(2, "0")
              ),
            },
          })
        }
      >
        Today's Seed
      </button>
      <button
        onClick={(event) =>
          dispatch({
            type: "generalSettings",
            option: {
              randomizerSeed: Math.trunc(Math.random() * 0xffffffff),
            },
          })
        }
      >
        Random Seed
      </button>
    </div>
  );
};

export default RandomizerSettings;
