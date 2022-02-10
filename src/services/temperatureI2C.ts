// import rpio from 'rpio';
import i2c, { PromisifiedBus } from "i2c-bus";


export class TemperatureSensor {
    constructor(address: number) {
        this.i2c = i2c;
        this.address = address;
    }

    i2c: typeof i2c;

    address: number;

    readTemperatures = async () => {
        try {
            const dataSize = 10;
            const rxbuffer = Buffer.alloc(dataSize);
            let result: number[] = [];
            const i2cOpen = await this.i2c.openPromisified(1);
            await i2cOpen.i2cRead(this.address, 10, rxbuffer);
            // console.log(rxbuffer);

            result = parseData(rxbuffer);
            // console.log(result);

            await i2cOpen.close();
        
            return result;
        }
        catch {
            let result = [-800, -800, -800, -800, -800];
            return result;
        }
    }
}

const parseData = (buffer: Buffer) => {
    let intArray: number[] = [];
    for(let i = 0; i < 5; i++) {
        intArray = [...intArray, bytesToInt(buffer[i*2], buffer[i*2+1]) / 10];
    }
    return intArray;
}

const bytesToInt = (highByte: number, lowByte: number) => {
    let parsed = (new Int16Array([(highByte<<8) | lowByte]))[0];
    return parsed;
}

export const temperatureSensor = new TemperatureSensor(0x65);

Object.freeze(temperatureSensor);