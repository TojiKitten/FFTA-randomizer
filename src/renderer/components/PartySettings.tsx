import * as React from "react";
import PartyMember from "./PartyMember";

export const PartySettings = () => {
  return (
    <div>
      <PartyMember name="March" changableRace={false} />
      <PartyMember name="Montblanc" changableRace={false}/>
      <PartyMember name="Unit 1" changableRace={true}/>
      <PartyMember name="Unit 2" changableRace={true}/>
      <PartyMember name="Unit 3" changableRace={true}/>
      <PartyMember name="Unit 4" changableRace={true}/>
    </div>
  );
};

export default PartySettings;
