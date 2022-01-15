import { probes } from "../stores/probes.js";
import { eventEmitter as readerEventEmitter } from "./reader.js";
import { EventEmitter } from "events";
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

export const eventEmitter = new EventEmitter();
export let heating = false;

setInterval(() => {
    if (heating == false && chamberProbe.currentValue < chamberProbe.targetValue + 2) {
        heating = true;
        eventEmitter.emit("heatingOn");
    }
    else if (heating == true && (chamberProbe.targetValue == 0 || chamberProbe.currentValue > chamberProbe.targetValue - 5)) {
        heating = false;
        eventEmitter.emit("heatingOff");
    }
    else
        return;
}, 500);