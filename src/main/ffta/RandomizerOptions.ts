import FFTAData from "./FFTAData";

enum MISSIONSCALING {
    NORMAL = "Normal",
    SCALEDAVERAGE = "Average",
    SCALEDHIGHEST = "Highest",
    LERP = "Lerp"
}

export interface iRandomizerOptions {
    missionScaling: string


}

export function defaultRandomizer(): iRandomizerOptions
{
    return {missionScaling: "Normal"}
}

export function randomizeFFTA(fftaData:FFTAData, options: iRandomizerOptions)
{
    switch(options.missionScaling)
    {
        case "Normal":
            fftaData.scaleMissionsHighest();
        break;
    }
}

export default iRandomizerOptions;
