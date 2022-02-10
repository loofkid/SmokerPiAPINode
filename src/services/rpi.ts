import { Gpio, terminate } from "pigpio";
import {heating} from "../stores/heating";
import { probes } from "../stores/probes";
import { EventEmitter } from "events";
import S from "s-js";

export const eventEmitter = new EventEmitter();

export const heatPin = new Gpio(5, {mode: Gpio.OUTPUT});
export const stopPin = new Gpio(6, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_UP, alert: true});

export const startHeating = () => {
    heatPin.digitalWrite(1);
    S.sample(heating).status = true;
    eventEmitter.emit("heatingOn");
}

export const stopHeating = () => {
    heatPin.digitalWrite(0)
    S.sample(heating).status = false;
    eventEmitter.emit("heatingOff");
}

export const watchStop = () => {
    stopPin.glitchFilter(10000);
    stopPin.on('alert', (level, tick) => {
        if (level === 0) {
            console.log("e-stop pressed!");
            heatPin.digitalWrite(0);
            S.sample(heating).status = false;
            S.sample(probes).forEach(p => p.targetValue = 0);
            probes(S.sample(probes));
        }
    });
}

export const clearGPIO = () => {
    heatPin.digitalWrite(0);
    stopPin.removeAllListeners();
}
