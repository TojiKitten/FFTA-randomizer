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

interface iFFTAItem extends FFTAObject {
  itemID: number;
  buyPrice: number;
  sellPrice: number;
  itemType: number;
  range: number;
  worn: number;
  doubleSword: boolean;
  doubleHand: boolean;
  monkeyGrip: boolean;
  discount: boolean;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
  // Still not sure what this is
  mythrilOrConsumable: boolean;
  attack: number;
  defense: number;
  mpower: number;
  resist: number;
  spd: number;
  evade: number;
  jump: number;
  move: number;
  abilitySetID: number;
  effect1: number;
  effect2: number;
  effect3: number;
  femaleOnly: boolean;
}

function loadItem(memory: number, buffer: Uint8Array): iFFTAItem {
  return {
    memory: memory,
    displayName: "",
    allowed: true,
    itemID: buffer[memory], // Just a guess for now
    buyPrice: buffer[memory + offsetITEMBUY],
    sellPrice: buffer[memory + offsetITEMSELL],
    itemType: buffer[memory + offsetITEMTYPE],
    range: buffer[memory + offsetITEMRANGE],
    worn: buffer[memory + offsetITEMWORN],
    doubleSword: (buffer[memory + offsetITEMFLAGS] & 0x1) === 1,
    doubleHand: (buffer[memory + offsetITEMRANGE] & 0x2) === 1,
    monkeyGrip: (buffer[memory + offsetITEMRANGE] & 0x4) === 1,
    discount: (buffer[memory + offsetITEMRANGE] & 0x8) === 1,
    tier1: (buffer[memory + offsetITEMRANGE] & 0x10) === 1,
    tier2: (buffer[memory + offsetITEMRANGE] & 0x20) === 1,
    tier3: (buffer[memory + offsetITEMRANGE] & 0x40) === 1,
    mythrilOrConsumable: (buffer[memory + offsetITEMRANGE] & 0x80) === 1,
    attack: buffer[memory + offsetITEMATTACK],
    defense: buffer[memory + offsetITEMDEFENSE],
    mpower: buffer[memory + offsetITEMPOWER],
    resist: buffer[memory + offsetITEMRESISTANCE],
    spd: buffer[memory + offsetITEMSPEED],
    evade: buffer[memory + offsetITEMEVADE],
    jump: buffer[memory + offsetITEMJUMP],
    move: buffer[memory + offsetITEMMOVE],
    abilitySetID: buffer[memory + offsetITEMABILITYSET],
    effect1: buffer[memory + offsetITEMEFFECT1],
    effect2: buffer[memory + offsetITEMEFFECT2],
    effect3: buffer[memory + offsetITEMEFFECT3],
    femaleOnly: false,
  };
}

const iFoo = (item: iFFTAItem) => {};

const iBar = (item: iFFTAItem) => {};

class FFTAItem implements FFTAObject {
  itemID = -1;
  buyPrice = 0;
  sellPrice = 0;
  itemType = -1;
  range = -1;
  worn = -1;
  doubleSword = false;
  doubleHand = false;
  monkeyGrip = false;
  discount = false;
  tier1 = false;
  tier2 = false;
  tier3 = false;
  mythrilOrConsumable = false;
  attack = 0;
  defense = 0;
  mpower = 0;
  resist = 0;
  spd = 0;
  evade = 0;
  jump = 0;
  move = 0;
  abilitySetID = -1;
  effect1 = 0;
  effect2 = 0;
  effect3 = 0;
  femaleOnly = false;
  memory = -1;
  displayName = "";
  allowed = false;

  read() {
    throw new Error("Method not implemented.");
  }
  write() {
    throw new Error("Method not implemented.");
  }
}

const foo = (item: FFTAItem) => {};

const bar = (item: iFFTAItem) => {};
