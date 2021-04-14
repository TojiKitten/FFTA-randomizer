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
      encodedStrings.push(buffer.slice(start, i));
      start = i+1;
    }
  }

  // Decode each entry into a string NOT IMPLEMENTED
  let names = new Array<string>();
  for(var i = 0; i < encodedStrings.length; i++)
  {
    let name = "";
    var firstByte;
    var secondByte;
    let encodedName:Uint8Array = encodedStrings[i];
    for(var j = 0; j < encodedName.byteLength; j++)
    {
      firstByte = encodedName[j].toString(16).toUpperCase();
      if(encodedName[j+1])
      {
        secondByte = encodedName[j+1].toString(16).toUpperCase();
      }
      else{
        secondByte = undefined;
      }
      
      if(secondByte && charTable[firstByte + secondByte])
      {
        name += charTable[firstByte + secondByte];
        j++;
      }
      else if(charTable[firstByte]){
        name += charTable[firstByte];
      }
    }
    names.push(name);
  }
  return names;
}
