import * as React from "react";
import { useContext, useReducer } from "react";

const initialRandomizerOptions = {
  generalSettings: {
    romLoaded: false,
    currentPage: "general",
    isRandomized: false,
    raceMode: false,
    randomizerSeed: parseInt(
      new Date().getFullYear().toString() +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        new Date().getUTCDate().toString().padStart(2, "0")
    ),
    cutscenes: "all",
    laws: "normal",
    startingGold: 5000,
    frostyMageBoost: false,
    disableClans: false,
    quickOptions: false,
    noJudgeTurn: false,
    mpRegen: "normal",
  },
  missionSettings: {
    storySetting: "normal",
    storyLength: 5,
    missionScaling: "normal",
    missionScalingValue: 1,
    missionRewards: "normal",
    disableRewardPreview: false,
    forcedRecruits: false,
    apBoost: -1,
    gilReward: -1,
    randomEnemies: false,
    enemyAbilityPercentage: 0,
    randomEnemyItems: false,
  },
  partySettings: {
    partyRNGEnabled: false,
    partyMembers: [
      {
        name: "Marche",
        raceChangeable: true,
        race: "human",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
      {
        name: "Montblanc",
        raceChangeable: true,
        race: "moogle",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
      {
        name: "Member 3",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
      {
        name: "Member 4",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
      {
        name: "Member 5",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
      {
        name: "Member 6",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masterType: "abilities",
        masteredAbilities: 0,
      },
    ],
  },
  jobSettings: {
    jobRequirements: "normal",
    randomizeJobEquipment: false,
    randomizedWeaponsAmount: 0,
    randomizedArmorAmount: 0,
    randomizeResistances: false,
    human: [
      { jobName: "Soldier", enabled: true },
      { jobName: "Paladin", enabled: true },
      { jobName: "Fighter", enabled: true },
      { jobName: "Thief", enabled: true },
      { jobName: "Ninja", enabled: true },
      { jobName: "White Mage", enabled: true },
      { jobName: "Black Mage", enabled: true },
      { jobName: "Illusionist", enabled: true },
      { jobName: "Blue Mage", enabled: true },
      { jobName: "Archer", enabled: true },
      { jobName: "Hunter", enabled: true },
    ],
    bangaa: [
      { jobName: "Warrior", enabled: true },
      { jobName: "Dragoon", enabled: true },
      { jobName: "Defender", enabled: true },
      { jobName: "Gladiator", enabled: true },
      { jobName: "White Monk", enabled: true },
      { jobName: "Bishop", enabled: true },
      { jobName: "Templar", enabled: true },
    ],
    nuMou: [
      { jobName: "White Mage", enabled: true },
      { jobName: "Black Mage", enabled: true },
      { jobName: "Time Mage", enabled: true },
      { jobName: "Illusionist", enabled: true },
      { jobName: "Alchemist", enabled: true },
      { jobName: "Beastmaster", enabled: true },
      { jobName: "Morpher", enabled: true },
      { jobName: "Sage", enabled: true },
    ],
    viera: [
      { jobName: "Fencer", enabled: true },
      { jobName: "Elementalist", enabled: true },
      { jobName: "Red Mage", enabled: true },
      { jobName: "White Mage", enabled: true },
      { jobName: "Summoner", enabled: true },
      { jobName: "Archer", enabled: true },
      { jobName: "Assassin", enabled: true },
      { jobName: "Sniper", enabled: true },
    ],
    moogle: [
      { jobName: "Animist", enabled: true },
      { jobName: "Mog Knight", enabled: true },
      { jobName: "Gunner", enabled: true },
      { jobName: "Thief", enabled: true },
      { jobName: "Juggler", enabled: true },
      { jobName: "Gadgeteer", enabled: true },
      { jobName: "Black Mage", enabled: true },
      { jobName: "Time Mage", enabled: true },
    ],
  },
  abilitySettings: {
    abilities: "normal",
    bannedAbilities: new Array<string>(),
  },
  itemSettings: {
    shopItems: "default",
    randomChance: 50,
    bannedItems: new Array<number>(),
  },
  missionLogSettings: {
    showAllMissions: false,
    showCompletedMissions: false,
    showRepeatableMissions: true,
    showMissingMissionItems: true,
    missionItems: {},
  },
};

type RandomizerOption = keyof typeof initialRandomizerOptions;
export type RandomizerState = typeof initialRandomizerOptions;
export type JobSettingsState = typeof initialRandomizerOptions.jobSettings;

function randomizerReducer(
  state: RandomizerState,
  action: { type: RandomizerOption; option: any }
) {
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      ...action.option,
    },
  };
}

const RandomizerContext = React.createContext(initialRandomizerOptions);

const RandomizerUpdateContext = React.createContext({} as any);

export function useRandomizer() {
  return useContext(RandomizerContext);
}

export function useRandomizerUpdate() {
  return useContext(RandomizerUpdateContext);
}

export function RandomizerProvider({ children }: any) {
  const [state, dispatch] = useReducer(
    randomizerReducer,
    initialRandomizerOptions
  );

  return (
    <RandomizerContext.Provider value={state}>
      <RandomizerUpdateContext.Provider value={dispatch}>
        {children}
      </RandomizerUpdateContext.Provider>
    </RandomizerContext.Provider>
  );
}
