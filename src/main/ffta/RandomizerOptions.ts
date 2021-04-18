import FFTAData from "./FFTAData";

export type iRandomizerOptions = Record<string, any>;

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: iRandomizerOptions) {  
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
  fftaData.handleDisableJobs([
    options["humanJobs"],
    options["bangaaJobs"],
    options["nuMouJobs"],
    options["vieraJobs"],
    options["moogleJobs"],
  ]);
  fftaData.handlePartyMembers(options["partyMember"]);
  fftaData.handleShopItems(options["shopitems"]);

  console.log("DONE");
}

export default iRandomizerOptions;
