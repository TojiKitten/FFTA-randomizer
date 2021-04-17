import { RaceMap } from "../ffta/FFTAData";
import { FFTAJob } from "../ffta/job/FFTAJob";

export function percentageMPRegen(rom: Uint8Array) {
  const codeInject = [
    0x0a,
    0x21,
    0xaf,
    0xf0,
    0x10,
    0xfb,
    0x04,
    0x1c,
    0x46,
    0x46,
    0x70,
    0x68,
    0x00,
    0x68,
    0x15,
    0x21,
    0x34,
    0xf0,
    0xff,
    0xfe,
    0x24,
    0x18,
    0x70,
    0x68,
    0x00,
    0x68,
    0x16,
    0x21,
    0x34,
    0xf0,
    0xf9,
    0xfe,
    0x25,
    0x1c,
    0x84,
    0x42,
    0x02,
    0xd9,
    0x05,
    0x1c,
  ];

  rom.set([0x16], 0x9308c);
  rom.set(codeInject, 0x93092);
}

export function unlockAllJobs(jobs: RaceMap<FFTAJob>)
{
    let allJobs = [jobs.Human, jobs.Bangaa, jobs.NuMou, jobs.Viera,jobs.Moogle];
    
    allJobs.forEach((race) => {
        race.forEach((job) =>{
            job.setRequirements(0x0);
        });
    });
}

export function lockAllJobs(jobs: RaceMap<FFTAJob>)
{
    let allJobs = [jobs.Human, jobs.Bangaa, jobs.NuMou, jobs.Viera,jobs.Moogle];
    
    allJobs.forEach((race) => {
        race.forEach((job) =>{
            job.setRequirements(0x20);
        });
    });
}