import FFTAData from "./FFTAData";

export type iRandomizerOptions = Record<string, any>;

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: iRandomizerOptions) {
  fftaData.handleMissionScaling(options["missionScaling"], options["missionScalingValue"]);
  fftaData.handleCutScene(options["cutscenes"]);
}

export default iRandomizerOptions;
