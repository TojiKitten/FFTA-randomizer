type Codeinject = {
    offset: number;
    data: number[];
  };
  
  const skipTutorial: Codeinject[] = [
    { offset: 0xa19975, data: [0x04] }, //random byte write?
    { offset: 0x9a7430, data: [0x1d, 0x02, 0x0d, 0x1c, 0x09, 0x00, 0x17, 0x02] }, //skip snowball
    {
      offset: 0x9a797c,
      data: [
        0x4d,
        0x00,
        0x22,
        0x00,
        0x1a,
        0x01,
        0x03,
        0x01,
        0x1a,
        0x3b,
        0x04,
        0x01,
        0x1a,
        0x01,
        0x02,
        0x01,
        0x1d,
        0x03,
        0x17,
        0x05,
      ],
    }, //skip lizard men
  ];
  
  const NoSkipTutorial: Codeinject[] = [
    { offset: 0x9a63a2, data: [0x1d, 0x02, 0x0d, 0x1c, 0x09, 0x00, 0x17, 0x02] },
    {
      offset: 0x9a7fbe,
      data: [
        0x4d,
        0x00,
        0x22,
        0x00,
        0x1a,
        0x01,
        0x03,
        0x01,
        0x1a,
        0x3b,
        0x04,
        0x01,
        0x1a,
        0x01,
        0x02,
        0x01,
        0x1d,
        0x03,
        0x17,
        0x05,
      ],
    },
  ];
  
  export function skipCutscenes(
    romData: Uint8Array,
    skipCutscene: boolean
  ): Uint8Array {
    let newRomData = romData;
    if (skipCutscene) {
      skipTutorial.forEach((element) => {
        newRomData = writeData(newRomData, element.offset, element.data);
      });
    } else {
      NoSkipTutorial.forEach((element) => {
        newRomData = writeData(newRomData, element.offset, element.data);
      });
    }
  
    return newRomData;
  }
  
  function writeData(
    buffer: Uint8Array,
    offset: number,
    data: number[]
  ): Uint8Array {
    let newbuffer = buffer;
    for (let i = 0; i < data.length; i++) {
      newbuffer[offset + i] = data[i];
    }
    return newbuffer;
  }