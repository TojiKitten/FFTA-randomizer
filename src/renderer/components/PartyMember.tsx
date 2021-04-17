import * as React from "react";

type props = {
  name: string;
  changableRace: boolean;
};

export const PartyMember = ({ name, changableRace }: props) => {
  let raceChanger = <br />;
  if (changableRace) {
    raceChanger = (
      <>
        Race:
        <select id="race">
          <option value="Human">Human</option>
          <option value="Moogle">Moogle</option>
          <option value="Viera">Viera</option>
          <option value="Bangaa">Bangaa</option>
          <option value="Nu Mou">Nu Mou</option>
        </select>
        <br />
      </>
    );
  }
  return (
    <div className="partyMember">
      {name}
      <br />
      {raceChanger}
      Job:
      <select id="job">
        <option value="random">Random</option>
        <option value="Fighter">Fighter</option>
        <option value="Soldier">Soldier</option>
        <option value="Paladin">Paladin</option>
        <option value="Thief">Thief</option>
        <option value="Ninja">Ninja</option>
        <option value="White Mage">White Mage</option>
        <option value="Black Mage">Black Mage</option>
        <option value="Illusionist">Illusionist</option>
        <option value="Blue Mage">Blue Mage</option>
        <option value="Hunter">Hunter</option>
      </select>
      <br />
      <input type="checkbox" id="rngEquip" />
      <label htmlFor="rngEquip">randomize Equipment</label>
      <br />
      Level:
      <input type="number" id="level" defaultValue="3"></input>
      <br />
      Mastered Abilities:
      <input type="number" id="abilities" defaultValue="0"></input>
    </div>
  );
};

export default PartyMember;
