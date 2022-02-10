import { probes } from "../stores/probes";
import { EventEmitter } from "events";
import { heating } from "../stores/heating";
import { startHeating, stopHeating, eventEmitter as rpiEventEmitter } from "../services/rpi";
import S from "s-js";
const [chamberProbe, probe1, probe2, probe3, probe4] = probes();

export const eventEmitter = new EventEmitter();

rpiEventEmitter.on("heatingOn", () => eventEmitter.emit("heatingOn"));
rpiEventEmitter.on("heatingOff", () => eventEmitter.emit("heatingOff"));
rpiEventEmitter.on("emergencyStop", () => {
    eventEmitter.emit("emergencyStop");
    stopHeating();
    chamberProbe.targetValue = 0;
});

setInterval(() => {
    if (S.sample(heating).status == false && chamberProbe.connected && chamberProbe.currentValue < chamberProbe.targetValue - 4) {
        startHeating();
    }
    else if (S.sample(heating).status == true && (chamberProbe.targetValue == 0 || chamberProbe.currentValue > chamberProbe.targetValue + 1)) {
        stopHeating();
    }
    else
        return;
}, 500);