import { probes } from "../stores/probes.js";
import { EventEmitter } from "events";
import { heating } from "../stores/heating.js";
import { startHeating, stopHeating, eventEmitter as rpiEventEmitter } from "../services/rpi.js";
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

export const eventEmitter = new EventEmitter();

rpiEventEmitter.on("heatingOn", () => eventEmitter.emit("heatingOn"));
rpiEventEmitter.on("heatingOff", () => eventEmitter.emit("heatingOff"));

setInterval(() => {
    if (heating.status == false && chamberProbe.connected && chamberProbe.currentValue < chamberProbe.targetValue - 4) {
        startHeating();
    }
    else if (heating.status == true && (chamberProbe.targetValue == 0 || chamberProbe.currentValue > chamberProbe.targetValue + 1)) {
        stopHeating();
    }
    else
        return;
}, 500);