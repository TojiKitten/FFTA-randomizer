import { first } from "lodash";

const charTable = require("./charLookup.json");

/**
 * Converts a number into a 2 byte Uint8Array
 * @param value - The number to convert
 * @param littleEndian - Use little endian or not
 * @returns A Uint8Array of length 2
 */
export function getShortUint8Array(value: number, littleEndian: boolean) {
  var firstByte = littleEndian ? value & 0xff : (value >> 0x8) & 0xff;
  var secondByte = littleEndian ? (value >> 0x8) & 0xff : value & 0xff;

  return new Uint8Array([firstByte, secondByte]);
}

/**
 * Converts a number into a 4 byte Uint8Array
 * @param value - The number to convert
 * @param littleEndian - Use little endian or not
 * @returns A Uint8Array of length 4
 */
export function getWordUint8Array(value: number, littleEndian: boolean) {
  var firstByte = littleEndian ? value & 0xff : (value >> 24) & 0xff;
  var secondByte = littleEndian ? (value >> 8) & 0xff : (value >> 16) & 0xff;
  var thirdByte = littleEndian ? (value >> 16) & 0xff : (value >> 8) & 0xff;
  var fourthByte = littleEndian ? (value >> 24) & 0xff : value & 0xff;

  return new Uint8Array([firstByte, secondByte, thirdByte, fourthByte]);
}

/**
 * Converts a 2 byte Uint8Array into a number
 * @param value - The buffer to read in
 * @param littleEndian - Use little endian or not
 * @returns Converted number
 */
export function convertShortUint8Array(
  value: Uint8Array,
  littleEndian: boolean
): number {
  var firstByte = littleEndian ? value[1] : value[0];
  var secondByte = littleEndian ? value[0] : value[1];

  return (firstByte << 0x8) | secondByte;
}

/**
 * Converts a 4 byte Uint8Array into a number
 * @param value - The buffer to read in
 * @param littleEndian - Use little endian or not
 * @returns Converted number
 */
export function convertWordUint8Array(
  value: Uint8Array,
  littleEndian: boolean
): number {
  var firstByte = littleEndian ? value[3] : value[0];
  var secondByte = littleEndian ? value[2] : value[1];
  var thirdByte = littleEndian ? value[1] : value[2];
  var fourthByte = littleEndian ? value[0] : value[3];

  return (firstByte << 24) + (secondByte << 16) + (thirdByte << 8) + fourthByte;
}

/**
 * Decodes a buffer according to the FFTA lookup table
 * @param encodedName - The buffer holding the text to decode
 * @returns A decoded string
 */
export function decodeFFTAText(encodedName: Uint8Array): string {
  var firstByte;
  var secondByte;
  var name = "";

  // Decode each letter and add to the nme
  for (var i = 0; i < encodedName.byteLength; i++) {
    // Read number as hex and to uppercase, to match table
    firstByte = encodedName[i].toString(16).toUpperCase();

    // Handle boundry
    if (encodedName[i + 1]) {
      secondByte = encodedName[i + 1].toString(16).toUpperCase();
    } else {
      // Set to undefined to match case when there's a miss on the table
      secondByte = undefined;
    }

    // Check if the matches a short long key
    if (secondByte && charTable[firstByte + secondByte]) {
      name += charTable[firstByte + secondByte];
      // Skip one iteration since it was two bytes
      i++;
    }
    // Check if table matches a byte long key
    else if (charTable[firstByte]) {
      name += charTable[firstByte];
    }
  }
  return name;
}

/**
 * Converts an address in FFTA to a number, and localizes to the ROM. Possibly change to allow for localizing or not.
 * @param address A Uint8Array of length 4 in little endian
 * @returns The address as a number
 */
export function getLittleEndianAddress(address: Uint8Array): number {
  /* An example of how a memory address would appear in the rom would be: A0 D1 54 08 (formation offeset)
We need to convert that to -> 0x0854D1A0 for little endian.
In addition, 0x0854D1A0 is the full address in reference to GBA architecture. 
We have to drop the "08", which is why it gets left off in this method.*/
  return (address[2] << 16) | (address[1] << 8) | address[0];
}

export function joinUint8Array(arrays: Array<Uint8Array>) {
  let newArray = new Uint8Array();

  arrays.forEach((array) => {
    let tempArray = new Uint8Array(newArray.length + array.length);
    tempArray.set(newArray);
    tempArray.set(array, newArray.length);
    newArray = tempArray;
  });
  return newArray;
}
