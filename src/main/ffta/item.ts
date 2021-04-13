import { FFTAData, FFTAObject } from "./data";

// === Static Constants ====
// Each is a short
const offsetITEMBUY = 0x04;
const offsetITEMSELL = 0x06;
// See Item enum for order, Sword = 1
const offsetITEMTYPE = 0x08;
const offsetITELEMENT = 0x09;
const offsetITEMRANGE = 0x0a;
// One Hand or Two Hands
const offsetITEMWORN = 0x0b;
//For flags it's one bit for each
// (Doublesword, Doublehand, Monkey Grip, Discount, Tier 1, tier 2, tier 3, Mythril/Consumable item (not sure what this specifically is)
const offsetITEMFLAGS = 0x0c;
// Type of item that this appears under in Nono's Link Shop
const offsetNONOSHOP = 0x0e;
const offsetITEMATTACK = 0x10;
const offsetITEMDEFENSE = 0x11;
const offsetITEMPOWER = 0x12;
const offsetITEMRESISTANCE = 0x13;
const offsetITEMSPEED = 0x14;
const offsetITEMEVADE = 0x15;
const offsetITEMMOVE = 0x16;
const offsetITEMJUMP = 0x17;
// ID of the effect
const offsetITEMEFFECT1 = 0x1a;
const offsetITEMEFFECT2 = 0x1b;
const offsetITEMEFFECT3 = 0x1c;
// ID of the ability set
const offsetITEMABILITYSET = 0x1d;

// ==== Class ====
export class FFTAItem implements FFTAObject {
  itemID = -1;
  buyPrice = -1;
  sellPrice = -1;
  itemType = -1;
  range = -1;
  worn = -1;
  doubleSword = -1;
  doubleHand = -1;
  monkeyGrip = -1;
  discount = -1;
  tier1 = -1;
  tier2 = -1;
  tier3 = -1;
  mythrilOrConsumable = -1;
  attack = -1;
  defense = -1;
  mpower = -1;
  resist = -1;
  spd = -1;
  evade = -1;
  jump = -1;
  move = -1;
  abilitySetID = -1;
  effect1 = -1;
  effect2 = -1;
  effect3 = -1;
  femaleOnly = false;
  memory = -1;
  displayName = "";
  allowed = false;

  constructor(
    memory: number,
    itemName: string,
    femaleOnly: boolean,
    fftaData: FFTAData
  ) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.displayName = itemName;
    this.allowed = true;

    // Save FFTAItem Properties
    this.itemID = fftaData.readByte(memory); // Just a guess for now
    this.buyPrice = fftaData.readShort(memory + offsetITEMBUY, true);
    this.sellPrice = fftaData.readShort(memory + offsetITEMSELL, true);
    this.itemType = fftaData.readByte(memory + offsetITEMTYPE);
    this.range = fftaData.readByte(memory + offsetITEMRANGE);
    this.worn = fftaData.readByte(memory + offsetITEMWORN);
    this.doubleSword = fftaData.readByte(memory + offsetITEMFLAGS) & 0x1;
    this.doubleHand = (fftaData.readByte(memory + offsetITEMFLAGS) >> 1) & 0x1;
    this.monkeyGrip = (fftaData.readByte(memory + offsetITEMFLAGS) >> 2) & 0x1;
    this.discount = (fftaData.readByte(memory + offsetITEMFLAGS) >> 3) & 0x1;
    this.tier1 = (fftaData.readByte(memory + offsetITEMFLAGS) >> 4) & 0x1;
    this.tier2 = (fftaData.readByte(memory + offsetITEMFLAGS) >> 5) & 0x1;
    this.tier3 = (fftaData.readByte(memory + offsetITEMFLAGS) >> 6) & 0x1;
    this.mythrilOrConsumable =
      (fftaData.readByte(memory + offsetITEMFLAGS) >> 7) & 0x1;
    this.attack = fftaData.readByte(memory + offsetITEMATTACK);
    this.defense = fftaData.readByte(memory + offsetITEMDEFENSE);
    this.mpower = fftaData.readByte(memory + offsetITEMPOWER);
    this.resist = fftaData.readByte(memory + offsetITEMRESISTANCE);
    this.spd = fftaData.readByte(memory + offsetITEMSPEED);
    this.evade = fftaData.readByte(memory + offsetITEMEVADE);
    this.jump = fftaData.readByte(memory + offsetITEMJUMP);
    this.move = fftaData.readByte(memory + offsetITEMMOVE);
    this.abilitySetID = fftaData.readByte(memory + offsetITEMABILITYSET);
    this.effect1 = fftaData.readByte(memory + offsetITEMEFFECT1);
    this.effect2 = fftaData.readByte(memory + offsetITEMEFFECT2);
    this.effect3 = fftaData.readByte(memory + offsetITEMEFFECT3);
  }

  write(fftaData: FFTAData) {
    let flags =
      (this.mythrilOrConsumable << 7) |
      (0x1 << 6) |
      (0x1 << 5) |
      (0x1 << 4) |
      (this.discount << 3) |
      (this.monkeyGrip << 2) |
      (this.doubleHand << 1) |
      this.doubleSword;

    fftaData.writeByte(this.memory + offsetITEMFLAGS, flags);
  }
}

// ==== Known Addresses ====
export const knownItems = [
  { memory: 0x51d1a0, displayName: "Shortsword", femaleOnly: false },
  { memory: 0x51d1c0, displayName: "Silver Sword", femaleOnly: false },
  { memory: 0x51d1e0, displayName: "Buster Sword", femaleOnly: false },
  { memory: 0x51d200, displayName: "Burglar Sword", femaleOnly: false },
  { memory: 0x51d220, displayName: "Gale Sword", femaleOnly: false },
  { memory: 0x51d240, displayName: "Blood Sword", femaleOnly: false },
  { memory: 0x51d260, displayName: "Restorer", femaleOnly: false },
  { memory: 0x51d280, displayName: "Vitanova", femaleOnly: false },
  { memory: 0x51d2a0, displayName: "Mythril Sword", femaleOnly: false },
  { memory: 0x51d2c0, displayName: "Victor Sword", femaleOnly: false },
  { memory: 0x51d2e0, displayName: "Onion Sword", femaleOnly: false },
  { memory: 0x51d300, displayName: "Chirijiraden", femaleOnly: false },
  { memory: 0x51d320, displayName: "Laglace Sword", femaleOnly: false },
  { memory: 0x51d340, displayName: "Sweep Blade", femaleOnly: false },
  { memory: 0x51d360, displayName: "Shadow Blade", femaleOnly: false },
  { memory: 0x51d380, displayName: "Sun Blade", femaleOnly: false },
  { memory: 0x51d3a0, displayName: "Atmos Blade", femaleOnly: false },
  { memory: 0x51d3c0, displayName: "Flametongue", femaleOnly: false },
  { memory: 0x51d3e0, displayName: "Air Blade", femaleOnly: false },
  { memory: 0x51d400, displayName: "Icebrand", femaleOnly: false },
  { memory: 0x51d420, displayName: "Kwigon Blad", femaleOnly: false },
  { memory: 0x51d440, displayName: "Ogun Blade", femaleOnly: false },
  { memory: 0x51d460, displayName: "Pearl Blad", femaleOnly: false },
  { memory: 0x51d480, displayName: "Paraiba Blade", femaleOnly: false },
  { memory: 0x51d4a0, displayName: "Venus Blade", femaleOnly: false },
  { memory: 0x51d4c0, displayName: "Materia Blade", femaleOnly: false },
  { memory: 0x51d4e0, displayName: "Mythril Blade", femaleOnly: false },
  { memory: 0x51d500, displayName: "Ebon Blade", femaleOnly: false },
  { memory: 0x51d520, displayName: "Adaman Blade", femaleOnly: false },
  { memory: 0x51d540, displayName: "Ayvuir Red", femaleOnly: false },
  { memory: 0x51d560, displayName: "Ayvuir Blue", femaleOnly: false },
];
// { memory: 0x, displayName: "", femaleOnly: false },

export default FFTAItem;
