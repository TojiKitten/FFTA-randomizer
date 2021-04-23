const BITNOISE1 = 0xb5297a4d;
const BITNOISE2 = 0x68e31da4;
const BITNOISE3 = 0x1b56c4e9;

// Using Squirrel3 Noise Generator from Squirrel Eiserloh's GDC talk on Noise Generators
export class NoiseGenerator {
  seed: number;
  position: number;
  constructor() {
    this.seed = Math.round(Math.random() * 100000);
    this.position = 0;
  }

  /**
   * Sets seed to a given value and resets position
   * @param seed 
   */
  setSeed(seed: number) {
    this.position = 0;
    this.seed = seed;
  }

 /**
  *
  * Sets the position to a given value
  * @param position - Number to start RNG
  */
  setPosition(position: number) {
    this.position = position;
  }

  /**
   * Sets position to 0
   */
  resetSeed() {
    this.position = 0;
  }

  /**
   * Increase position by 1 and get the next number of RNG
   * @returns Random number
   */
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

  /**
   * Get a random bit
   * @returns 1 or 0
   */
  randomBit() {
    return this.next() & 1;
  }

  /**
   * Get a random byte
   * @returns 0 - 0xFF
   */
  randomByte() {
    var _byte = 0;

    for (var i = 0; i < 8; i++) {
      _byte = _byte | (this.randomBit() << i);
    }

    return _byte;
  }

  /**
   * Get 32 bit number
   * @returns 0 - 0xFFFFFFFF
   */
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

  /**
   * Get a random number between 0 and a maximum
   * @param range - Maximum value
   * @returns A random number in range (inclusive)
   */
  randomIntMax(range: number): number {
    var range = range;
    if (range <= 0) return 0;
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

  /**
   * Get a random number between min and max
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns A random number in range (inclusive)
   */
  randomIntRange(min: number, max: number): number {
    var range = max - min;
    if (range <= 0) return 0;
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
