const {probes} = require("../stores/probes");
const {eventEmitter: readerEventEmitter} = require("./reader");
const {EventEmitter} = require("events");
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

const eventEmitter = new EventEmitter();

setInterval(() => {
    if (module.exports.heating == false && chamberProbe.currentValue < chamberProbe.targetValue + 2) {
        module.exports.heating = true;
        eventEmitter.emit("heatingOn");
    }
    else if (module.exports.heating == true && (chamberProbe.targetValue == 0 || chamberProbe.currentValue > chamberProbe.targetValue - 5)) {
        module.exports.heating = false;
        eventEmitter.emit("heatingOff");
    }
    else
        return;
}, 500);

module.exports = {
    eventEmitter: eventEmitter,
    heating: false,
}