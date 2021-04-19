const BITNOISE1 = 0xb5297a4d;
const BITNOISE2 = 0x68e31da4;
const BITNOISE3 = 0x1b56c4e9;

// Using Squirrel3 Noise Generator from Squirrel Eiserloh's GDC talk on Noise Generators
export class NoiseGenerator {
  seed: number;
  position: number;
  constructor() {
    this.seed = Math.round(Math.random()*100000);
    this.position = 0;
  }

  setSeed(seed: number) {
    this.position = 0;
    this.seed = seed;
  }

  setPosition(position: number) {
    this.position = position;
  }

  resetSeed() {
    this.position = 0;
  }

  next() {
    this.position++;
    let mangled = this.position;
    mangled *= BITNOISE1;
    mangled += this.seed;
    mangled ^= mangled >> 8;
    mangled += BITNOISE2;
    mangled ^= mangled << 8;
    mangled *= BITNOISE3;
    mangled ^= mangled >> 8;
    return mangled;
  }

  randomBit() {
    return this.next() & 1;
  }

  // Untested
  randomByte() {
    var _byte = 0;

    for (var i = 0; i < 8; i++) {
      _byte = _byte | (this.randomBit() << i);
    }

    return _byte;
  }

  // Don't use this directly, see shuffledLaws
  randomSort<Type>(element1: Type, element2: Type) {
    return this.randomBit() == 1 ? 1 : -1;
  }

  randomUint32(): number {
    var range = 0xffffffff;
    var bits = Math.floor(Math.log2(range)) + 1;
    var number = 0;
    do {
      number = 0;
      for (var i = 0; i < bits; i++) {
        number = number | (this.randomBit() << i);
      }
    } while (number > range);

    return number;
  }

  randomIntMax(range: number): number {
    var range = range;
    if(range <= 0) return 0;
    var bits = Math.floor(Math.log2(range)) + 1;
    var number = 0;
    do {
      number = 0;
      for (var i = 0; i < bits; i++) {
        number = number | (this.randomBit() << i);
      }
    } while (number > range);

    return number;
  }

  randomIntRange(min: number, max: number): number {
    var range = max - min;
    if(range <= 0) return 0;
    var min = min;
    var bits = Math.floor(Math.log2(range)) + 1;
    var number = 0;
    do {
      number = 0;
      for (var i = 0; i < bits; i++) {
        number = number | (this.randomBit() << i);
      }
    } while (number > range);

    return min + number;
  }
}

export default NoiseGenerator;
