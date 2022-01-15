const {eventEmitter: readerEventEmitter} = require("./background_services/reader");
const {eventEmitter: controlEventEmitter, heating} = require("./background_services/smoker_control");
const {connectClient: connectRedisClient} = require("./services/redis");
const {probes, maxTargetTemp} = require("./stores/probes");
const express = require("express");

const redisClient = connectRedisClient();


const app = express();
const PORT = 8080;

const router = express.Router();

readerEventEmitter.on("valueRead", () => console.log(probes));
controlEventEmitter.on("heatingOn", () => console.log("heating chamber"));
controlEventEmitter.on("heatingOff", () => console.log("chamber heating stopped"));

app.use("/api", router)

app.get("/", (req, res) => {
    res.status(200).send({
        greeting: "Hello",
        subject: "World!"
    });
});

router.route("/probes").get((req, res) => {
    res.status(200).send(probes);
});

router.route("/probes/:probe").get((req, res) => {
    if (!probes[req.params.probe]) {
        res.status(404).send("no probe by that id");
    }
    else {
        res.status(200).send({
            [req.params.probe]: probes[req.params.probe],
        });
    }
});

router.route("/probes/:probe/target/:value").get((req, res) => {
    if (parseInt(req.params.value) > maxTargetTemp || parseInt(req.params.value) < 0) {
        res.status(400).send(`target temperature must be below ${maxTargetTemp} and above 0`);
    }
    else {
        probes[req.params.probe].targetValue = parseInt(req.params.value);
        res.status(200).send({[req.params.probe]: probes[req.params.probe]});
    }
});

router.route("/heating").get((req, res) => {
    res.status(200).send(heating);
});

app.listen(
    PORT,
    () => console.log(`Ready at http://localhost:${PORT}`)
);