import NoiseGenerator from "../utils/NoiseGenerator";

/**
 * Change ability animations to ones that won't break the game. Temporary.
 * @param rom - Buffer holding FFTA
 */
export function animationFixRaw(rom: Uint8Array) {
  // Parley
  rom.set([0x58], 0x552188);
  // Saint Cross
  rom.set([0x0c], 0x5522a0);
  // Tremor
  rom.set([0x11, 0x01], 0x552310);
  // Mow Down
  rom.set([0x11, 0x01], 0x552348);
  // Whirlwind
  rom.set([0x11, 0x01], 0x5523b8);
  // Revive
  rom.set([0x06], 0x55240c);
  // Exorcise
  rom.set([0xad], 0x552428);
  // Holy Sign
  rom.set([0x9b], 0x552444);
  // Far Fist
  rom.set([0xb1], 0x55247c);
  // Wild Swing
  rom.set([0x11, 0x01], 0x5524ec);
  // Fire Sword
  rom.set([0xe7], 0x552540);
  // Bolt Sword
  rom.set([0xe8], 0x55255c);
  // Ice Sword
  rom.set([0xe9], 0x552578);
  // War Cry
  rom.set([0x11, 0x01], 0x5525b0);
  // Lancet
  rom.set([0x12], 0x55263c);
  // Fire Breath
  rom.set([0x11, 0x01], 0x552674);
  // Bolt Breath
  rom.set([0x11, 0x01], 0x552690);
  // Ice Breath
  rom.set([0x11, 0x01], 0x5526ac);
  // Bangaa Cry
  rom.set([0x6b], 0x5526e4);
  // Swallowtail
  rom.set([0x11, 0x01], 0x552850);
  // Throw
  rom.set([0x69], 0x5528c0);
  // Wood Veil
  rom.set([0x34], 0x5528dc);
  // Fire Veil
  rom.set([0x33], 0x5528f8);
  // Earth Veil
  rom.set([0x38], 0x552914);
  // Metal Veil
  rom.set([0x36], 0x552930);
  // Water Veil
  rom.set([0x39], 0x55294c);
  // Hurl
  rom.set([0x69], 0x552fa4);
  // Ring
  rom.set([0x26], 0x552fc0);
  // Firebomb
  rom.set([0x6c], 0x552fdc);
  // Ball
  rom.set([0xea], 0x552ff8);
  // Dagger
  rom.set([0x90], 0x553014);
  // Smile
  rom.set([0x22], 0x553030);
  // Gil Toss
  rom.set([0x4f], 0x55304c);
  // Conceal
  rom.set([0xa9], 0x5530bc);
}

export function injectAnimationFixes(rom: Uint8Array) {
  rom.set([0x4b, 0x18, 0x47, 0x39, 0x9a, 0xa3, 0x08], 0x21005);
  rom.set([0x00, 0x4b, 0x18, 0x47, 0xdf, 0x99, 0xa3, 0x08], 0x9767c);
  rom.set([0x00, 0x4b, 0x18, 0x47, 0x0d, 0x9a, 0xa3, 0x08], 0x97734);
  rom.set([0x00, 0x4b, 0x18, 0x47, 0xbd, 0x99, 0xa3, 0x08], 0x988b0);
}

export function injectAllLocations(rom: Uint8Array) {
  rom.set(
    [0x00, 0x00, 0x00, 0x4b, 0x18, 0x47, 0x49, 0x99, 0xa3, 0x08],
    0x30126
  );

  // Stops location placement events
  rom.set([0x00, 0x20], 0x306d6);
  rom.set([0x00, 0x20], 0x4880c);

  // Fixes Present Day
  rom.set([0x4b], 0x563b79);
}

export function injectUnlockJobs(rom: Uint8Array) {
  rom.set(
    [
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4b, 0x18, 0x47, 0x21, 0x99,
      0xa3, 0x08,
    ],
    0xc9342
  );
}

export function setQuickOptions(rom: Uint8Array) {
  rom.set([0xc8, 0x03], 0x51ba4e);
}

export function stopClans(rom: Uint8Array) {
  rom.set([0xc0, 46], 0xcf802);
}

const FREESPACE = 0xa39920;
// If ASM hacks are updated, this also needs to be updated
const ASMLOCATION = 0xa3999c;

export function ASMHacks(rom: Uint8Array) {
  rom.set(
    [
      0x05, 0x26, 0x30, 0x1c, 0x00, 0xf0, 0x06, 0xf8, 0x76, 0x1c, 0x2f, 0x2e,
      0xf9, 0xdb, 0x00, 0x00, 0x03, 0x4b, 0x18, 0x47, 0x01, 0x21, 0x00, 0x00,
      0x02, 0x4c, 0x20, 0x47, 0x00, 0xbd, 0x00, 0x00, 0xc3, 0x93, 0x0c, 0x08,
      0x75, 0x95, 0x0c, 0x08, 0x00, 0x27, 0x38, 0x1c, 0x0e, 0x49, 0xc9, 0x5d,
      0x00, 0xf0, 0x13, 0xf8, 0x7f, 0x1c, 0x1e, 0x2f, 0xf7, 0xdb, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x0a, 0x4b, 0x0b, 0x20, 0x18, 0x70, 0x0a, 0x4b,
      0xf8, 0x20, 0x18, 0x70, 0x17, 0x20, 0x58, 0x70, 0x40, 0x20, 0x58, 0x71,
      0x03, 0x27, 0x07, 0x4b, 0x18, 0x47, 0x01, 0x22, 0x00, 0x00, 0x00, 0x00,
      0x05, 0x4c, 0x20, 0x47, 0x00, 0xbd, 0x00, 0x00, 0x9c, 0x99, 0xa3, 0x08,
      0x58, 0x2e, 0x00, 0x02, 0xf7, 0x1f, 0x00, 0x02, 0x3b, 0x01, 0x03, 0x08,
      0x45, 0x00, 0x03, 0x08, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
      0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13,
      0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x00, 0x00,
      0x50, 0x29, 0x06, 0xdb, 0x78, 0x29, 0x04, 0xd8, 0x10, 0xb4, 0x01, 0x24,
      0x64, 0x03, 0x21, 0x43, 0x10, 0xbc, 0x0b, 0x4b, 0x9e, 0x46, 0x01, 0x23,
      0x00, 0xf8, 0x0a, 0x4b, 0x9e, 0x46, 0x00, 0x2d, 0x00, 0xf8, 0xec, 0x2d,
      0x05, 0xd3, 0x08, 0x4b, 0x9d, 0x42, 0x02, 0xd8, 0xec, 0x3d, 0xad, 0x00,
      0xec, 0x35, 0xaa, 0x18, 0x01, 0x92, 0x00, 0x22, 0x02, 0x92, 0x04, 0x4b,
      0x18, 0x47, 0x00, 0x00, 0xdc, 0x75, 0x09, 0x08, 0xb8, 0x88, 0x09, 0x08,
      0xff, 0x1f, 0x00, 0x00, 0x85, 0x76, 0x09, 0x08, 0x80, 0x46, 0x01, 0x26,
      0x20, 0x06, 0x00, 0x16, 0xec, 0x2f, 0x05, 0xd3, 0x05, 0x4b, 0x9f, 0x42,
      0x02, 0xd8, 0xec, 0x3f, 0xbf, 0x00, 0xec, 0x37, 0x3f, 0x18, 0x2c, 0x1c,
      0x4c, 0x34, 0x28, 0x6c, 0x01, 0x4b, 0x18, 0x47, 0xff, 0x1f, 0x00, 0x00,
      0x45, 0x77, 0x09, 0x08, 0x00, 0xb5, 0x30, 0xb4, 0x05, 0x1c, 0x0a, 0x1c,
      0x1a, 0x49, 0x80, 0x00, 0x40, 0x18, 0x03, 0x68, 0x03, 0x20, 0x19, 0x4c,
      0xa2, 0x42, 0x02, 0xd8, 0xec, 0x2a, 0x08, 0xd2, 0x0d, 0xe0, 0x22, 0x40,
      0x50, 0x24, 0x16, 0x4b, 0xad, 0x00, 0x5b, 0x59, 0x10, 0x40, 0x12, 0x1b,
      0x06, 0xe0, 0x10, 0x40, 0xec, 0x3a, 0x13, 0x4b, 0xad, 0x00, 0x5b, 0x59,
      0x00, 0xe0, 0x10, 0x40, 0x02, 0x28, 0x0a, 0xd8, 0x01, 0x28, 0x08, 0xd3,
      0x04, 0x21, 0x49, 0x42, 0x11, 0x40, 0x48, 0x00, 0x40, 0x18, 0x40, 0x00,
      0x0c, 0x30, 0x0c, 0x22, 0x06, 0xe0, 0x04, 0x21, 0x49, 0x42, 0x11, 0x40,
      0x48, 0x00, 0x40, 0x18, 0x40, 0x00, 0x00, 0x22, 0xc0, 0x18, 0x01, 0x68,
      0x00, 0x29, 0x00, 0xd1, 0x98, 0x18, 0x30, 0xbc, 0x02, 0xbc, 0x08, 0x47,
      0x44, 0x0e, 0x39, 0x08, 0xff, 0x1f, 0x00, 0x00, 0x40, 0x9c, 0xa3, 0x08,
      0x44, 0x9c, 0xa3, 0x08,
    ],
    FREESPACE
  );
}

export function randomizeLocations(rom: Uint8Array, rng: NoiseGenerator) {
  let availablelocationIDs = [
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0a, 0x0b, 0x0c,
    0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1c, 0x1d,
  ];

  const palace = 0x1b;
  const royalValley = 0x08;

  let newLocations = [];
  for (let i = 0; i < 0x1e; i++) {
    switch (i) {
      case 0x0:
        newLocations.push(palace);
        break;
      case 0x1d:
        newLocations.push(royalValley);
        break;
      default:
        newLocations.push(
          availablelocationIDs.splice(
            rng.randomIntMax(availablelocationIDs.length - 1),
            1
          )[0]
        );
        break;
    }
    rom.set(newLocations, ASMLOCATION);
  }
}
