import * as React from "react";
import { useContext, useReducer } from "react";

const initialRandomizerOptions = {
  generalSettings: {
    romLoaded: false,
    currentPage: "general",
    isRandomized: false,
    randomizerSeed: 0,
    missionScaling: "normal",
    missionScalingValue: 1,
    cutscenes: "all",
    missionRewards: "normal",
    apBoost: 0,
    laws: "normal",
    startingGold: 5000,
    frostyMageBoost: false,
    noJudgeTurn: false,
  },
  partySettings: {
    partyRNGEnabled: false,
    partyMembers: [
      {
        name: "Marche",
        raceChangeable: false,
        race: "human",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
      {
        name: "Montblanc",
        raceChangeable: false,
        race: "moogle",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
      {
        name: "Member 3",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
      {
        name: "Member 4",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
      {
        name: "Member 5",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
      {
        name: "Member 6",
        raceChangeable: true,
        race: "random",
        job: "random",
        rngEquip: false,
        level: 3,
        masteredAbilities: 0,
      },
    ],
    jobRequirements: "normal",
    abilities: "normal",
    mpRegen: "normal",
  },
  jobSettings: {
    human: {
      soldier: true,
      paladin: true,
      fighter: true,
      thief: true,
      ninja: true,
      whiteMage: true,
      blackMage: true,
      illusionist: true,
      blueMage: true,
      archer: true,
      hunter: true,
    },
    bangaa: {
      warrior: true,
      dragoon: true,
      defender: true,
      gladiator: true,
      whiteMonk: true,
      bishop: true,
      templar: true,
    },
    nuMou: {
      whiteMage: true,
      blackMage: true,
      timeMage: true,
      illusionist: true,
      alchemist: true,
      beastmaster: true,
      morpher: true,
      sage: true,
    },
    viera: {
      fencer: true,
      elementalist: true,
      regMage: true,
      whiteMage: true,
      summoner: true,
      archer: true,
      assassin: true,
      sniper: true,
    },
    moogle: {
      animist: true,
      mogKnight: true,
      gunner: true,
      thief: true,
      juggler: true,
      gadgeteer: true,
      blackMage: true,
      timeMage: true,
    },
  },
  shopSettings: {
    shopitems: "default",
  },
};

type RandomizerOption = keyof typeof initialRandomizerOptions;
export type RandomizerState = typeof initialRandomizerOptions;

function randomizerReducer(
  state: typeof initialRandomizerOptions,
  action: any
) {
  switch (action.type) {
    case "generalSettings":
      const newGeneralSettings = {
        ...state.generalSettings,
        ...action.option,
      };
      console.log(newGeneralSettings);
      return { ...state, generalSettings: newGeneralSettings };
    default:
      return { ...state };
  }
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
