import gpio from "rpi-gpio";
import {heating} from "../stores/heating.js";
import { EventEmitter } from "events";

export const eventEmitter = new EventEmitter();

export const startHeating = () => {
    // gpio.setup(4, gpio.DIR_OUT, (err) => {
    //     if (err) {
    //         console.log(err);
    //         return
    //     }
    //     gpio.write(4, true, (err) => {
    //         if (err) {
    //             console.log(err);
    //             return
    //         }
            heating.status = true;
            eventEmitter.emit("heatingOn");
    //     });
    // });
}

export const stopHeating = () => {
    // gpio.setup(4, gpio.DIR_OUT, (err) => {
    //     if (err) {
    //         console.log(err);
    //         return
    //     }
    //     gpio.write(4, false, (err) => {
    //         if (err) {
    //             console.log(err);
    //             return
    //         }
            heating.status = false;
            eventEmitter.emit("heatingOff");
    //     });
    // })
}


