import * as React from "react";
import PartyMember from "./PartyMember";

export const PartySettings = () => {
  return (
    <div>
      <PartyMember name="March" />
      <PartyMember name="Montblanc" />
      <PartyMember name="Unit 1" />
      <PartyMember name="Unit 2" />
      <PartyMember name="Unit 3" />
    </div>
  );
};

export default PartySettings;
