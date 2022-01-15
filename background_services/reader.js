const {EventEmitter} = require('events');
const {probes} = require("../stores/probes");
const {chamberProbe, probe1, probe2, probe3, probe4} = probes;

const eventEmitter = new EventEmitter();

const getRandomTempIncrease = () => Math.round(Math.random()) * (Math.round(Math.random())  == 0 ? -1 : 1);

setInterval(() => {
    chamberProbe.currentValue += getRandomTempIncrease();
    probe1.currentValue += getRandomTempIncrease();
    probe2.currentValue += getRandomTempIncrease();
    probe3.currentValue += getRandomTempIncrease();
    probe4.currentValue += getRandomTempIncrease();

    eventEmitter.emit("valueRead");
}, 2000);

module.exports = {
    eventEmitter: eventEmitter,
}