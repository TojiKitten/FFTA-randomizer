import * as React from "react";

export const PartySettings = () => {
  return (
    <div>
      March
      <br />
      Job:
      <select id="jobMarch">
        <option value="Random">Random</option>
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
      <input type="checkbox" id="rngEquipMarch" />
      <label htmlFor="rngEquipMarch">randomize Equipment</label>
      <br />
      Level:
      <input type="number" id="marchLevel" defaultValue="3"></input>
      <br />
      Mastered Abilities:
      <input type="number" id="marchAbilities" defaultValue="0"></input>
    </div>
  );
};

export default PartySettings;
