import { eventEmitter as readerEventEmitter } from "./background_services/reader.js";
import { eventEmitter as controlEventEmitter } from "./background_services/smoker_control.js";
import { connectClient as connectRedisClient, client as redisClient, redisConfig } from "./services/redis.js";
import { probes, maxTargetTemp } from "./stores/probes.js";
import { heating } from "./stores/heating.js";
import { redisSetup } from "./setup.js";
import express from "express";
import { createServer } from "http";
import { io, createIOClient } from "./services/socket.io/socketio.js";
import mdns from "mdns";
// import session from "express-session";
// import passport from "passport";
// const RedisStore = require("connect-redis")(session);

await connectRedisClient();
 
const firstRun = Boolean((await redisClient.hGetAll("smokerpi:settings")).firstRun);

const firstRunSetup = async () => {
    await redisSetup(redisClient);
}

if (firstRun) {
    await firstRunSetup();
}


const app = express();
const PORT = 8080;
const httpServer = createServer(app);
createIOClient(httpServer);
const ad = mdns.createAdvertisement(mdns.tcp("smokerpi"), 8080);

const router = express.Router();

readerEventEmitter.on("valueRead", () => {
    console.log(probes);
    io.emit("valueRead", probes);
});
controlEventEmitter.on("heatingOn", () => {
    console.log("heating chamber");
    io.emit("heatingOn");
});
controlEventEmitter.on("heatingOff", () => {
    console.log("chamber heating stopped");
    io.emit("heatingOff");
});

io.on("connection", (socket) => {
    socket.emit("connected");
});

// app.use(session({
//     store: new RedisStore({
//         url: redisConfig.url,
//     }),
//     secret: "adk3SPVD%Y@8nvpA&dvVMY!9JmpTKoiyE5bk8^6wk#%gQKfYe4^BNZKC%VMayhd2sar%Hbgg!$Sa",
//     resave: false,
//     saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

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

router.route("/probes/maxtargettemp").get((req, res) => {
    res.status(200).send(maxTargetTemp.toString());
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
    if (!probes[req.params.probe]) {
        res.status(404).send("no probe by that id");
    }
    else if (parseInt(req.params.value) > maxTargetTemp || parseInt(req.params.value) < 0) {
        res.status(400).send(`target temperature must be below ${maxTargetTemp} and above 0`);
    }
    else {
        probes[req.params.probe].targetValue = parseInt(req.params.value);
        res.status(200).send({[req.params.probe]: probes[req.params.probe]});
    }
});

router.route("/probes/:probe/name/:value").get((req, res) => {
    if (!probes[req.params.probe]) {
        res.status(404).send("no probe by that id");
    }
    else {
        probes[req.params.probe].name = req.params.value;
        res.status(200).send({[req.params.probe]: probes[req.params.probe]});
    }
});

router.route("/heating").get((req, res) => {
    res.status(200).send(heating.status);
});

httpServer.listen(
    PORT,
    () => {
        console.log(`Ready at http://localhost:${PORT}`);
        ad.start();
    }
);