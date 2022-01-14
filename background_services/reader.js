const {EventEmitter} = require('events');
const {probes} = require("../stores/probes");
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

const eventEmitter = new EventEmitter();

const getRandomTemp = () => Math.floor(Math.random() * 180);

setInterval(() => {
    chamberProbe.currentValue = getRandomTemp();
    probe1.currentValue = getRandomTemp();
    probe2.currentValue = getRandomTemp();
    probe3.currentValue = getRandomTemp();
    probe4.currentValue = getRandomTemp();

    eventEmitter.emit("valueRead");
}, 2000);

module.exports = {
    eventEmitter: eventEmitter,
}