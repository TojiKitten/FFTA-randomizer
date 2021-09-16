import { RandomizerState } from "_/renderer/components/RandomizerProvider";
import FFTAData from "./ffta/FFTAData";

export type iRandomizerOptions = Record<string, any>;

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: RandomizerState) {
  const { generalSettings, partySettings, jobSettings, shopSettings } = options;
  fftaData.setSeed(generalSettings.randomizerSeed);
  fftaData.runForcedHacks();
  fftaData.handleRandomEnemies(generalSettings.randomEnemies);
  fftaData.handleMissionScaling(
    generalSettings.missionScaling,
    generalSettings.missionScalingValue
  );
  fftaData.handleCutScene(generalSettings.cutscenes);
  fftaData.handleAPBoost(generalSettings.apBoost);
  fftaData.handleStartingGold(generalSettings.startingGold);
  fftaData.handleFrostyBoost(generalSettings.frostyMageBoost);
  fftaData.handleNoJudgeTurn(generalSettings.noJudgeTurn);
  fftaData.handleLawOptions(generalSettings.laws);
  fftaData.handleRewardOptions(generalSettings.missionRewards);
  fftaData.handlePercentageMP(jobSettings.mpRegen);
  fftaData.handleJobRequirements(jobSettings.jobRequirements);
  fftaData.handleUnitAbilities(jobSettings.abilities);
  fftaData.handleDisableJobs(jobSettings);
  fftaData.handlePartyMembers(
    partySettings.partyRNGEnabled,
    partySettings.partyMembers
  );
  fftaData.handleShopItems(shopSettings.shopItems);
}

export default iRandomizerOptions;
