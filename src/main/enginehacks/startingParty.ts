import { RaceMap } from "../ffta/FFTAData";
import { getShortUint8Array } from "../ffta/FFTAUtils";
import { FFTAUnit } from "../ffta/formation/FFTAUnit";
import { FFTAJob } from "../ffta/job/FFTAJob";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function setStartingGold(rom: Uint8Array, gold: number) {
  rom.set(getShortUint8Array(gold, true), 0x986c);
}

export function setUnitData(
  unit: FFTAUnit,
  raceJobs: RaceMap<FFTAJob>,
  options: {
    name: string;
    raceChangable: boolean;
    race: string;
    job: string;
    rngEquip: boolean;
    level: number;
    masteredAbilities: number;
  },
  rng: NoiseGenerator
) {
  // Change Job
  if (options.job === "random") {
    let allowedJobs = getAvailableJobs(options.race, raceJobs);
    if (allowedJobs.length === 0) throw new Error("No allowed jobs");
    unit.setJob(allowedJobs[rng.randomIntMax(allowedJobs.length - 1)].jobId);
  } else {
  }

  // Change Equipment (Make sure it's valid)
  // Set mastered Abilities
  unit.setLevel(options.level);
}

function getAvailableJobs(race: string, raceJobs: RaceMap<FFTAJob>) {
  let allowedJobs: Array<FFTAJob> = [];
  switch (race) {
    case "human":
      raceJobs.Human.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "bangaa":
      raceJobs.Bangaa.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "nuMou":
      raceJobs.NuMou.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "viera":
      raceJobs.Viera.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "moogle":
      raceJobs.Moogle.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    default:
      raceJobs.Human.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Bangaa.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.NuMou.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Viera.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Moogle.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
  }

  return allowedJobs;
}
