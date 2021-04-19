export function animationFixRaw(rom:Uint8Array)
{
    // Parley
	rom.set([0x58], 0x552188);		
	// Saint Cross
	rom.set([0x0C], 0x5522A0);	
	// Tremor
	rom.set([0x111], 0x552310);	
	// Mow Down
	rom.set([0x111], 0x552348);	
	// Whirlwind
	rom.set([0x111], 0x5523B8);	
	// Revive
	rom.set([0x06], 0x55240C);	
	// Exorcise
	rom.set([0xAD], 0x552428);	
	// Holy Sign
	rom.set([0x9B], 0x552444);	
	// Far Fist
	rom.set([0xB1], 0x55247C);	
	// Wild Swing
	rom.set([0x111], 0x5524EC);	
	// Fire Sword
	rom.set([0xE7], 0x552540);	
	// Bolt Sword	
	rom.set([0xE8], 0x55255C);	
	// Ice Sword
	rom.set([0xE9], 0x552578);	
	// War Cry
	rom.set([0x111], 0x5525B0);	
	// Lancet	
	rom.set([0x12], 0x55263C);	
	// Fire Breath
	rom.set([0x111], 0x552674);	
	// Bolt Breath
	rom.set([0x111], 0x552690);	
	// Ice Breath
	rom.set([0x111], 0x5526AC);	
	// Bangaa Cry
	rom.set([0x6B], 0x5526E4);
	// Swallowtail
	rom.set([0x111], 0x552850);	
	// Throw
	rom.set([0x69], 0x5528C0);	
	// Wood Veil
	rom.set([0x34], 0x5528DC);	
	// Fire Veil
	rom.set([0x33], 0x5528F8);	
	// Earth Veil
	rom.set([0x38], 0x552914);	
	// Metal Veil
	rom.set([0x36], 0x552930);	
	// Water Veil
	rom.set([0x39], 0x55294C);	
	// Hurl
	rom.set([0x69], 0x552FA4);	
	// Ring
	rom.set([0x26], 0x552FC0);	
	// Firebomb
	rom.set([0x6C], 0x552FDC);	
	// Ball
	rom.set([0xEA], 0x552FF8);	
	// Dagger
	rom.set([0x90], 0x553014);	
	// Smile
	rom.set([0x22], 0x553030);	
	// Gil Toss
	rom.set([0x4F], 0x55304C);	
	// Conceal
	rom.set([0xA9], 0x5530BC);
}