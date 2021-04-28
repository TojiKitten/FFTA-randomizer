import FFTAData from "./ffta/FFTAData";

export type iRandomizerOptions = Record<string, any>;

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: iRandomizerOptions) {
  fftaData.setSeed(options["randomizerSeed"]);
  fftaData.runForcedHacks();
  fftaData.handleMissionScaling(
    options["missionScaling"],
    options["missionScalingValue"]
  );
  fftaData.handleCutScene(options["cutscenes"]);
  fftaData.handleAPBoost(options["apBoost"]);
  fftaData.handleStartingGold(options["startingGold"]);
  fftaData.handleFrostyBoost(options["frostyMageBoost"]);
  fftaData.handleNoJudgeTurn(options["noJudgeTurn"]);
  fftaData.handlePercentageMP(options["mpRegen"]);
  fftaData.handleJobRequirements(options["jobRequirements"]);
  fftaData.handleLawOptions(options["laws"]);
  fftaData.handleRewardOptions(options["missionRewards"]);
  fftaData.handleUnitAbilities(options["abilities"]);
  fftaData.handleDisableJobs(options["jobMap"]);
  fftaData.handlePartyMembers(
    options["partyRNGEnabled"],
    options["partyMember"]
  );
  fftaData.handleShopItems(options["shopitems"]);
}

export default iRandomizerOptions;
