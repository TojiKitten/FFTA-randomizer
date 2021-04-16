const BITNOISE1 = 0xB5297A4D
const BITNOISE2 = 0x68E31DA4
const BITNOISE3 = 0x1B56C4E9

// Using Squirrel3 Noise Generator from Squirrel Eiserloh's GDC talk on Noise Generators
export class NoiseGenerator
{
    seed:number;
    position: number;
    constructor()
    {
        this.seed = Math.random();
        this.position = 0;
    }

	setSeed(seed: number)
	{
		this.position = 0;
		this.seed = seed;	
	}
	
	setPosition(position: number)
	{
		this.position = position;	
	}
	
	resetSeed()
	{
		this.position = 0;	
	}
	
	next()
	{
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
	
	randomBit()
	{
		return this.next() & 1;
	}
	
	randomByte()
	{
		var _byte = 0;
		
		for(var i = 0; i < 8; i++)
		{
			_byte = _byte | (this.randomBit() << i);
		}
		
		return _byte;	
	}
	
    // Not sure if this works for TS, just ported form GMS2
	randomSort<Type>(element1:Type, element2:Type)
	{
		return this.randomBit() == 1 ? 1 : -1;
	}
	
	randomUint32():number
	{
		var range = 0xFFFFFFFF;
		var min = 0;

		var bits = Math.floor(Math.log2(range)) + 1;
		var number = 0;		
		
        do
		{
			number = 0;
			for(var i = 0; i < bits ; i++)
			{
				//var _bit = randomBit();
				number = number | (this.randomBit() << i);	
			}
		}while(number <= range)
		
        return number;
    }

    randomIntMax(range:number):number
	{
		var range = range;
		var min = 0;

		var bits = Math.floor(Math.log2(range)) + 1;
		var number = 0;		
		
        do
		{
			number = 0;
			for(var i = 0; i < bits ; i++)
			{
				//var _bit = randomBit();
				number = number | (this.randomBit() << i);	
			}
		}while(number <= range)
		
        return number;
    }

    randomIntRange(min:number, max:number):number
	{
		var range = max-min;
		var min = min;

		var bits = Math.floor(Math.log2(range)) + 1;
		var number = 0;		
		
        do
		{
			number = 0;
			for(var i = 0; i < bits ; i++)
			{
				//var _bit = randomBit();
				number = number | (this.randomBit() << i);	
			}
		}while(number <= range)
		
        return number;
    }
}

export default  NoiseGenerator;