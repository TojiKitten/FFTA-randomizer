import FFTAData from "../FFTAData";
import * as FFTAUtils from "../utils/FFTAUtils";

export function firstPass(fftaData: FFTAData) {
  let allSprites: Array<any> = [];

  fftaData.animations.forEach((animation) => {
    let spriteSheetLocations = {};
    animation
      .filter((animationPointer) => animationPointer > 0)
      .forEach((animationPointer) => {
        const keyFrames = FFTAUtils.convertWordUint8Array(
          fftaData.rom.slice(animationPointer, animationPointer + 4),
          true
        );

        for (var i = 0; i < keyFrames; i++) {
          const start = animationPointer + 4 + i * 0x14;
          const sheetPosition = FFTAUtils.convertWordUint8Array(
            fftaData.rom.slice(start, start + 4),
            true
          );
          const oam = FFTAUtils.convertShortUint8Array(
            fftaData.rom.slice(start + 4, start + 8),
            true
          );
          spriteSheetLocations = {
            ...spriteSheetLocations,
            [sheetPosition.toString(16)]: oam.toString(16),
          };
        }
      });

    allSprites.push(spriteSheetLocations);
  });

  Object.entries(allSprites[0x0])
    .sort((a, b) => {
      return parseInt(a[0], 16) > parseInt(b[0], 16) ? 1 : -1;
    })
    .forEach((entry, n) => {
      console.log(`${n} ${entry[0]} : ${entry[1]}`);
    });

  type KeyFrame = {
    offset: number;
    oam: number;
    duration: number;
    unknown: number;
    short1: number;
    short2: number;
    xPos: number;
    yPos: number;
    short5: number;
  };

  const buildAnimation = (keyFrames: Array<KeyFrame>) => {
    let animation = new Uint8Array(
      FFTAUtils.getWordUint8Array(keyFrames.length, true)
    );

    keyFrames.forEach((frame: KeyFrame) => {
      const offset = new Uint8Array(
        FFTAUtils.getWordUint8Array(frame.offset, true)
      );
      const oam = new Uint8Array(FFTAUtils.getShortUint8Array(frame.oam, true));
      const duration = new Uint8Array([frame.duration]);
      const unknown = new Uint8Array([frame.unknown]);
      const short1 = new Uint8Array(
        FFTAUtils.getShortUint8Array(frame.short1, true)
      );
      const short2 = new Uint8Array(
        FFTAUtils.getShortUint8Array(frame.short2, true)
      );
      const xPos = new Uint8Array(
        FFTAUtils.getShortUint8Array(frame.xPos, true)
      );
      const yPos = new Uint8Array(
        FFTAUtils.getShortUint8Array(frame.yPos, true)
      );
      const short5 = new Uint8Array(
        FFTAUtils.getShortUint8Array(frame.short5, true)
      );
      animation = FFTAUtils.joinUint8Array([
        animation,
        offset,
        oam,
        duration,
        unknown,
        short1,
        short2,
        xPos,
        yPos,
        short5,
      ]);
    });

    const alignment = 4 - (animation.length % 4);
    if (alignment != 4) {
      animation = FFTAUtils.joinUint8Array([
        animation,
        new Uint8Array(alignment),
      ]);
    }
    return animation;
  };

  const soldierFrames = Object.entries(allSprites[0x0]).sort((a, b) => {
    return parseInt(a[0], 16) > parseInt(b[0], 16) ? 1 : -1;
  });

  let newWeapon0 = buildAnimation([
    {
      offset: parseInt(soldierFrames[20][0], 16),
      oam: soldierFrames[20][1] as number,
      duration: 0x6,
      unknown: 0x1,
      short1: 0x0,
      short2: 0x0,
      xPos: 0x8,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[24][0], 16),
      oam: soldierFrames[24][1] as number,
      duration: 0x16,
      unknown: 0x1,
      short1: 0x0,
      short2: 0x2,
      xPos: 0x7,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[24][0], 16),
      oam: soldierFrames[24][1] as number,
      duration: 0x1,
      unknown: 0x8,
      short1: 0x2,
      short2: 0x2,
      xPos: 0x7,
      yPos: 0x1,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[24][0], 16),
      oam: soldierFrames[24][1] as number,
      duration: 0x1,
      unknown: 0x1,
      short1: 0x0,
      short2: 0x0,
      xPos: 0x8,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[25][0], 16),
      oam: soldierFrames[25][1] as number,
      duration: 0x1,
      unknown: 0x1,
      short1: 0x0,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[25][0], 16),
      oam: soldierFrames[25][1] as number,
      duration: 0x1,
      unknown: 0x8,
      short1: 0x1,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x1,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[25][0], 16),
      oam: soldierFrames[25][1] as number,
      duration: 0x2,
      unknown: 0x1,
      short1: 0x0,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[25][0], 16),
      oam: soldierFrames[25][1] as number,
      duration: 0x1,
      unknown: 0x8,
      short1: 0x0,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x1,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[26][0], 16),
      oam: soldierFrames[26][1] as number,
      duration: 0x19,
      unknown: 0x1,
      short1: 0x0,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[26][0], 16),
      oam: soldierFrames[26][1] as number,
      duration: 0x1,
      unknown: 0x8,
      short1: 0x3,
      short2: 0xfffe,
      xPos: 0x9,
      yPos: 0x1,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[20][0], 16),
      oam: soldierFrames[20][1] as number,
      duration: 0xa,
      unknown: 0x1,
      short1: 0x0,
      short2: 0x0,
      xPos: 0x8,
      yPos: 0x0,
      short5: 0x0,
    },
    {
      offset: parseInt(soldierFrames[6][0], 16),
      oam: soldierFrames[6][1] as number,
      duration: 0x8,
      unknown: 0x1,
      short1: 0x0,
      short2: 0x0,
      xPos: 0x8,
      yPos: 0x0,
      short5: 0x0,
    },
  ]);

  console.log(newWeapon0);
}
