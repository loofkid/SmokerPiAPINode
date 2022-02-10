import { EventEmitter } from 'events';
// import { getTemperature, eventEmitter as adsEventEmitter } from '../services/ads1x15.js';
import {temperatureSensor} from '../services/temperatureI2C';
import { probes, Probe } from "../stores/probes";
// const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

export const eventEmitter = new EventEmitter();

const getProbeTemps = async () => {
    const temps = await temperatureSensor.readTemperatures();

    probes().forEach((probe, i) => {
        probe.currentValue = temps[i];
        if (probe.connected && (temps[i] == -500 || temps[i] == -800)) probe.connected = false;
        if (!probe.connected && temps[i] != -500 && temps[i] != -800) probe.connected = true;
    });
    probes(probes());
}

setInterval(async () => {
    // chamberProbe.currentValue += getRandomTempIncrease();
    // for (const probe of Object.keys(probes)) {
    //     readProbeTemp(probes[probe]);
    // }
    await getProbeTemps();

    eventEmitter.emit("valueRead");
}, 1000);