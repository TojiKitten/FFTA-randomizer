import * as React from "react";

export const GeneralSettings = () => {
  return (
    <div>
      Story Enemy Levels:
      <select id="enemyLevel">
        <option value="Normal">Normal</option>
        <option value="Modified">Modified</option>
        <option value="Average">Scaled - Average</option>
        <option value="Highest">Scaled - Highest</option>
      </select>
      <input type="number" defaultValue="0" id="toScale" />
      <br />
      cutscenes:
      <select name="cutscenes" id="cutscenes">
        <option value="All">All</option>
        <option value="None">None</option>
        <option value="No Tutorial">None + No Tutorial</option>
      </select>
      <br />
      Mission Rewards:
      <select name="rewards" id="rewards">
        <option value="normal">Normal</option>
        <option value="random">Random</option>
        <option value="shuffled">Shuffled</option>
      </select>
      <br />
      AP Boost:
      <input type="number" defaultValue="0" id="apBoost" />
      <br />
      Laws:
      <select name="laws" id="laws">
        <option value="Normal">Normal</option>
        <option value="Shuffled">Shuffled</option>
      </select>
      <br />
      Starting Gold:
      <input type="number" id="gold" />
      <br />
      <input type="checkbox" id="frostyBoost" />
      <label htmlFor="frostyBoost">Frosty Mage Boost</label>
      <br />
      <input type="checkbox" id="noJudgeTurn" />
      <label htmlFor="noJudgeTurn">no Judge Turn</label>
    </div>
  );
};

export default GeneralSettings;
