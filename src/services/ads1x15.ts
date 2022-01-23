import ads1x15 from "ads1x15";

export const getTemperature = async (channel: number, address: number) => {
    const adc = new ads1x15();

    await adc.openBus(1);

    adc.setAddress(0x48);

    const refVoltage: number = await adc.readSingleEnded({channel: 0});
    // console.log(refVoltage);

    adc.setAddress(address);

    const probeVoltage: number = await adc.readSingleEnded({channel: channel});
    // console.log(probeVoltage);

    const resistor2 = 21600;
    const aValue = 0.0007343140544;
    const bValue = 0.0002157437229;
    const cValue = 0.0000000951568577;

    const resistance = resistor2 * ((refVoltage / probeVoltage) - 1);
    
    const temperatureK = 1 / (aValue + bValue * Math.log(resistance) + cValue * Math.pow(Math.log(resistance), 3));
    const temperatureC = temperatureK - 272.15;
    const temperatureF = 9 / 5 * temperatureC + 32;

    return temperatureF;
}


