import * as React from "react";
import PartyMember from "./PartyMember";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const PartySettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();

  return (
    <div>
      <label htmlFor="enablePartyRandomization">
        Enable Party Randomization
      </label>
      <input
        id="enablePartyRandomization"
        type="checkbox"
        checked={state.partySettings.partyRNGEnabled}
        onChange={(event) => {
          dispatch({
            type: "partySettings",
            option: { partyRNGEnabled: event.target.checked },
          });
        }}
      />

      {state.partySettings.partyRNGEnabled && (
        <div className="partyList">
          {state.partySettings.partyMembers.map((member) => (
            <>
              <PartyMember {...member} />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartySettings;
