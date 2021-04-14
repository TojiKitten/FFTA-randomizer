import * as React from "react";

export const JobSettings = () => {
  return (
    <div>
      <div className="jobList">
        Options <br/>
        job Requirements:
        <select name="requirements" id="requirements" >
          <option value="normal">Normal</option>
          <option value="unlocked">All Unlocked</option>
          <option value="locked">All Locked</option>
        </select>
        <br/>
        abilities:
        <select name="abilities" id="abilities">
          <option value="normal">Normal</option>
          <option value="random">Random</option>
          <option value="shuffled">Shuffled</option>
        </select>
        <br/>
        MP Regen:
        <select name="regen" id="regen">
          <option value="normal">Normal</option>
          <option value="precentage">Percentage</option>
        </select>
      </div>
      <div className="jobList">
        Human
        <br/>
        <input type="checkbox" id="humanSoldier" defaultChecked={true}/>
        <label htmlFor="humanSoldier">Soldier</label>
        <br/>
        <input type="checkbox" id="humanPaladin" defaultChecked={true}/>
        <label htmlFor="humanPaladin">Paladin</label>
        <br/>
        <input type="checkbox" id="humanFighter" defaultChecked={true}/>
        <label htmlFor="humanFighter">Fighter</label>
        <br/>
        <input type="checkbox" id="humanThief" defaultChecked={true}/>
        <label htmlFor="humanThief">Thief</label>
        <br/>
        <input type="checkbox" id="humanNinja" defaultChecked={true}/>
        <label htmlFor="humanNinja">Ninja</label>
        <br/>
        <input type="checkbox" id="humanWhiteMage" defaultChecked={true}/>
        <label htmlFor="humanWhiteMage">WhiteMage</label>
        <br/>
        <input type="checkbox" id="humanBlackMage" defaultChecked={true}/>
        <label htmlFor="humanBlackMage">BlackMage</label>
        <br/>
        <input type="checkbox" id="humanIllusionist" defaultChecked={true}/>
        <label htmlFor="humanIllusionist">Illusionist</label>
        <br/>
        <input type="checkbox" id="humanBlueMage" defaultChecked={true}/>
        <label htmlFor="humanBlueMage">BlueMage</label>
        <br/>
        <input type="checkbox" id="humanArcher" defaultChecked={true}/>
        <label htmlFor="humanArcher">Archer</label>
        <br/>
        <input type="checkbox" id="humanHunter" defaultChecked={true}/>
        <label htmlFor="humanHunter">Hunter</label>

      </div>
      <div className="jobList">
        Bangaa
        <br/>
        <input type="checkbox" id="bangaaWarrior" defaultChecked={true}/>
        <label htmlFor="bangaaWarrior">Warrior</label>
        <br/>
        <input type="checkbox" id="bangaaDragoon" defaultChecked={true}/>
        <label htmlFor="bangaaDragoon">Dragoon</label>
        <br/>
        <input type="checkbox" id="bangaaDefender" defaultChecked={true}/>
        <label htmlFor="bangaaDefender">Defender</label>
        <br/>
        <input type="checkbox" id="bangaaGladiator" defaultChecked={true}/>
        <label htmlFor="bangaaGladiator">Gladiator</label>
        <br/>
        <input type="checkbox" id="bangaaWhiteMonk" defaultChecked={true}/>
        <label htmlFor="bangaaWhiteMonk">WhiteMonk</label>
        <br/>
        <input type="checkbox" id="bangaaBishop" defaultChecked={true}/>
        <label htmlFor="bangaaBishop">Bishop</label>
        <br/>
        <input type="checkbox" id="bangaaTemplar" defaultChecked={true}/>
        <label htmlFor="bangaaTemplar">Templar</label>
      </div>
      <div className="jobList">
        Nu Mou
        <br/>
        <input type="checkbox" id="numouWhiteMage" defaultChecked={true}/>
        <label htmlFor="numouWhiteMage">WhiteMage</label>
        <br/>
        <input type="checkbox" id="numouBlackMage" defaultChecked={true}/>
        <label htmlFor="numouBlackMage">BlackMage</label>
        <br/>
        <input type="checkbox" id="numouTimeMage" defaultChecked={true}/>
        <label htmlFor="numouTimeMage">TimeMage</label>
        <br/>
        <input type="checkbox" id="numouIllusionist" defaultChecked={true}/>
        <label htmlFor="numouIllusionist">Illusionist</label>
        <br/>
        <input type="checkbox" id="numouAlchemist" defaultChecked={true}/>
        <label htmlFor="numouAlchemist">Alchemist</label>
        <br/>
        <input type="checkbox" id="numouBestmaster" defaultChecked={true}/>
        <label htmlFor="numouBestmaster">Beastmaster</label>
        <br/>
        <input type="checkbox" id="numouMorpher" defaultChecked={true}/>
        <label htmlFor="numouMorpher">Morpher</label>
      </div>
      <div className="jobList">
        Viera
        <br/>
        <input type="checkbox" id="vieraFencer" defaultChecked={true}/>
        <label htmlFor="vieraFencer">Fencer</label>
        <br/>
        <input type="checkbox" id="vieraElementalist" defaultChecked={true}/>
        <label htmlFor="vieraElementalist">Elementalist</label>
        <br/>
        <input type="checkbox" id="vieraRegMage" defaultChecked={true}/>
        <label htmlFor="vieraRegMage">RegMage</label>
        <br/>
        <input type="checkbox" id="vieraWhiteMage" defaultChecked={true}/>
        <label htmlFor="vieraWhiteMage">WhiteMage</label>
        <br/>
        <input type="checkbox" id="vieraSummoner" defaultChecked={true}/>
        <label htmlFor="vieraSummoner">Summoner</label>
        <br/>
        <input type="checkbox" id="vieraArcher" defaultChecked={true}/>
        <label htmlFor="vieraArcher">Archer</label>
        <br/>
        <input type="checkbox" id="vieraAssassin" defaultChecked={true}/>
        <label htmlFor="vieraAssassin">Assassin</label>
        <br/>
        <input type="checkbox" id="vieraSniper" defaultChecked={true}/>
        <label htmlFor="vieraSniper">Sniper</label>
      </div>
      <div className="jobList">
        Moogle
        <br/>
        <input type="checkbox" id="moogleAnimist" defaultChecked={true}/>
        <label htmlFor="moogleAnimist">Animist</label>
        <br/>
        <input type="checkbox" id="moogleMogKnight" defaultChecked={true}/>
        <label htmlFor="moogleMogKnight">MogKnight</label>
        <br/>
        <input type="checkbox" id="moogleGunner" defaultChecked={true}/>
        <label htmlFor="moogleGunner">Gunner</label>
        <br/>
        <input type="checkbox" id="moogleThief" defaultChecked={true}/>
        <label htmlFor="moogleThief">Thief</label>
        <br/>
        <input type="checkbox" id="moogleJuggler" defaultChecked={true}/>
        <label htmlFor="moogleJuggler">Juggler</label>
        <br/>
        <input type="checkbox" id="moogleGadgeteer" defaultChecked={true}/>
        <label htmlFor="moogleGadgeteer">Gadgeteer</label>
      </div>
    </div>
  );
};
export default JobSettings;
