export function getShortUint8Array(value: number, littleEndian: boolean) {
  var firstByte = littleEndian ? value & 0xff : (value >> 0x8) & 0xff;
  var secondByte = littleEndian ? (value >> 0x8) & 0xff : value & 0xff;

  return new Uint8Array([firstByte, secondByte]);
}

const charTable = require("./charLookup.json");
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


