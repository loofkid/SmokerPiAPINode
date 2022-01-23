import { EventEmitter } from 'events';
import { getTemperature } from '../services/ads1x15.js';
import { probes, Probe } from "../stores/probes.js";
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

export const eventEmitter = new EventEmitter();

const getRandomTempIncrease = () => Math.round(Math.random()) * (Math.round(Math.random())  == 0 ? -1 : 1);

const readProbeTemp = async (probe: Probe) => {
    const probeTemp = await getTemperature(probe.channel, probe.address);
    if (probeTemp < -128.6 && probe.connected) {
        probe.currentValue = 0;
        probe.connected = false;
        console.log(`${probe.name} probe not detected!`);
        eventEmitter.emit("probeDisconnect", probe.id);
    }
    else if (probeTemp >= -128.6 && !probe.connected) {
        probe.currentValue = probeTemp;
        probe.connected = true;
        console.log(`${probe.name} probe connected!`);
        eventEmitter.emit("probeConnect", probe.id);
    }
    else if (!probe.connected) {
        probe.currentValue = 0;
    }
    else {
        probe.currentValue = probeTemp;
    }
}

setInterval(async () => {
    // chamberProbe.currentValue += getRandomTempIncrease();
    await readProbeTemp(chamberProbe);
    probe1.currentValue += getRandomTempIncrease();
    probe2.currentValue += getRandomTempIncrease();
    probe3.currentValue += getRandomTempIncrease();
    probe4.currentValue += getRandomTempIncrease();

    eventEmitter.emit("valueRead");
}, 500);