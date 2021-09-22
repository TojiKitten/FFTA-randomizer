import { RandomizerState } from "_/renderer/components/RandomizerProvider";
import FFTAData from "./ffta/FFTAData";

export type iRandomizerOptions = Record<string, any>;

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: RandomizerState) {
  const {
    generalSettings,
    missionSettings,
    partySettings,
    jobSettings,
    shopSettings,
  } = options;
  fftaData.setSeed(generalSettings.randomizerSeed);
  fftaData.handleSeed(generalSettings.randomizerSeed);
  fftaData.handleCutScene(generalSettings.cutscenes);
  fftaData.handleStartingGold(generalSettings.startingGold);
  fftaData.handleFrostyBoost(generalSettings.frostyMageBoost);
  fftaData.handleNoJudgeTurn(generalSettings.noJudgeTurn);
  fftaData.handleLawOptions(generalSettings.laws);
  fftaData.handleAPBoost(missionSettings.apBoost);
  fftaData.handleRandomizedStory(
    missionSettings.storySetting,
    missionSettings.storyLength
  );
  fftaData.handleMissionScaling(
    missionSettings.missionScaling,
    missionSettings.missionScalingValue
  );
  fftaData.handleRandomEnemies(
    missionSettings.randomEnemies,
    missionSettings.enemyAbilityPercentage
  );
  fftaData.handleRewardOptions(missionSettings.missionRewards);
  fftaData.handleGilReward(missionSettings.gilReward);
  fftaData.handleRewardPreview(missionSettings.disableRewardPreview);
  fftaData.handlePercentageMP(jobSettings.mpRegen);
  fftaData.handleJobRequirements(jobSettings.jobRequirements);
  fftaData.handleUnitAbilities(jobSettings.abilities);
  fftaData.handleDisableJobs(jobSettings);
  fftaData.handlePartyMembers(
    partySettings.partyRNGEnabled,
    partySettings.partyMembers
  );
  fftaData.handleShopItems(shopSettings.shopItems, shopSettings.randomChance);
}

export default iRandomizerOptions;
