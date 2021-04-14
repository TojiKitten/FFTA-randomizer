export function getShortUint8Array(value: number, littleEndian: boolean) {
  var firstByte = littleEndian ? value & 0xff : (value >> 0x8) & 0xff;
  var secondByte = littleEndian ? (value >> 0x8) & 0xff : value & 0xff;

  return new Uint8Array([firstByte, secondByte]);
}

const charTable = require("./charLookup.json");
export function decodeFFTAText(buffer: Uint8Array):Array<string>
{
  // Slice the strings in the range into each entry
  let encodedStrings:Array<Uint8Array> = [];
  let start = 0;
  for(var i = 0; i < buffer.byteLength; i++)
  {
    if(buffer[i] === 0x0)
    {
      encodedStrings.push(buffer.slice(start, i-1));
      start = i+1;
    }
  }

  // Decode each entry into a string NOT IMPLEMENTED
  let names = new Array<string>();
  for(var i = 0; i < encodedStrings.length; i++)
  {
    let name = "Not Implemented";
    names.push(name);
  }

  return names;
}
