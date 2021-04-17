import FFTAData from "./FFTAData";

enum MISSIONSCALING {
  NORMAL = "Normal",
  SCALEDAVERAGE = "Average",
  SCALEDHIGHEST = "Highest",
  LERP = "Lerp",
}

export interface iRandomizerOptions {
  missionScaling: string;
  missionScalingValue: number;
  cutscenes: string;
}

export function defaultRandomizer(): iRandomizerOptions {
  return { missionScaling: "Normal", missionScalingValue: 25, cutscenes: "all" };
}


//probably getting really long when everything is implemented? best solution i can think off rn though
export function randomizeFFTA(fftaData: FFTAData, options: iRandomizerOptions) {
  switch (options.missionScaling) {
    case "Normal":
      fftaData.scaleMissionsHighest();
      break;
  }
  switch(options.cutscenes){
    case "all":
        break;
    case "none":
        fftaData.cutsceneNone();
        break;
    case "noTutorial":
        fftaData.cutsceneNoTutorial();
        break;
  }
}

export default iRandomizerOptions;
