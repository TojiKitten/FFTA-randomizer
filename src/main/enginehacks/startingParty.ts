import { getShortUint8Array } from "../ffta/FFTAUtils";
import { FFTAUnit } from "../ffta/formation/FFTAUnit";

export function setStartingGold(rom: Uint8Array, gold: number) {
  rom.set(getShortUint8Array(gold, true), 0x986c);
}

export function setUnitData(
  unit: FFTAUnit,
  options: {
    name: string;
    raceChangeable: boolean;
    race: string;
    job: string;
    rngEquip: boolean;
    level: number;
    masteredAbilities: number;
  }
) {
    // Change Job
    // Change Equipment (Make sure it's valid)
    // Set mastered Abilities
    unit.setLevel(options.level);
}
