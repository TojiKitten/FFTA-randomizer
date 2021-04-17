import { getShortUint8Array } from "../ffta/FFTAUtils";

export function setStartingGold(rom:Uint8Array, gold: number)
{
    rom.set(getShortUint8Array(gold, true), 0x986C);
}