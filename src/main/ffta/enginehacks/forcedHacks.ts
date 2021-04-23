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
  rom.set([0x111], 0x552310);
  // Mow Down
  rom.set([0x111], 0x552348);
  // Whirlwind
  rom.set([0x111], 0x5523b8);
  // Revive
  rom.set([0x06], 0x55240c);
  // Exorcise
  rom.set([0xad], 0x552428);
  // Holy Sign
  rom.set([0x9b], 0x552444);
  // Far Fist
  rom.set([0xb1], 0x55247c);
  // Wild Swing
  rom.set([0x111], 0x5524ec);
  // Fire Sword
  rom.set([0xe7], 0x552540);
  // Bolt Sword
  rom.set([0xe8], 0x55255c);
  // Ice Sword
  rom.set([0xe9], 0x552578);
  // War Cry
  rom.set([0x111], 0x5525b0);
  // Lancet
  rom.set([0x12], 0x55263c);
  // Fire Breath
  rom.set([0x111], 0x552674);
  // Bolt Breath
  rom.set([0x111], 0x552690);
  // Ice Breath
  rom.set([0x111], 0x5526ac);
  // Bangaa Cry
  rom.set([0x6b], 0x5526e4);
  // Swallowtail
  rom.set([0x111], 0x552850);
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
