import FFTAData from "./FFTAData";

enum MISSIONSCALING {
  NORMAL = "Normal",
  SCALEDAVERAGE = "Average",
  SCALEDHIGHEST = "Highest",
  LERP = "Lerp",
}

export type iRandomizerOptions = Record<string, any>;

export function defaultRandomizer(): iRandomizerOptions {
  return { missionScaling: "Normal", missionScalingValue: 25, cutscenes: "all" };
}

//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: iRandomizerOptions) {
  fftaData.handleCutScene(options["cutscenes"]);
}

export default iRandomizerOptions;
