import { eventEmitter as readerEventEmitter } from "./background_services/reader";
import { eventEmitter as controlEventEmitter } from "./background_services/smoker_control";
// import { connectClient as connectRedisClient, client as redisClient, redisConfig } from "./services/redis";
import { heating } from "./stores/heating";
// import { redisSetup } from "./setup";
import express from "express";
import { createServer } from "http";
import { io, createIOClient, registerPassportAuth } from "./services/socket.io/socketio";
import { clearGPIO, watchStop } from "./services/rpi";
import mdns, { rst } from "mdns";
import ip from "ip";
import {version} from '../package.json';
// import session from "express-session";
import passport from "passport";
import {Strategy as IpStrategy} from 'passport-ip';
import { registerIpAuth } from "./services/auth/auth";
import { createDefaults, setup } from "./setup";
import { probes } from "./stores/probes";
import { smokerSettings } from "./stores/smoker-settings";
import S from "s-js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { listKnownNetworks, scanForNetworks } from "./services/wifi";

global.settings = {};

global.settings.uidNamespace = 'b0f5b509-0570-4723-a3a2-266c4efe8caa';

global.settings.settingsPath = join(dirname(fileURLToPath(import.meta.url)), "configs", "settings.json");
const defaultSettingsPath = join(dirname(fileURLToPath(import.meta.url)), "configs", "settings.default.json");
if (fs.existsSync(defaultSettingsPath)) {
    setup(global.settings.settingsPath, defaultSettingsPath);
}

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
createIOClient(httpServer);
const ad = mdns.createAdvertisement(mdns.tcp("smokerpi"), 8080, {name: smokerSettings.name()});
watchStop();

const router = express.Router();

readerEventEmitter.on("valueRead", () => {
    // console.log(probes);
    io.emit("valueRead", probes());
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

io.on("probes", (socket) => {
    if (socket.data.probeId) {
        if (S.sample(probes).some(p => p.id == socket.data.probeId))
            socket.emit("probe", S.sample(probes).find(p => p.id == socket.data.probeId));
        else {
            socket.emit("unknown-probe", false);
        }
    }
    else socket.emit("probes", S.sample(probes));
});

io.on("smoker-name", (socket) => {
    socket.emit("smoker-name", S.sample(smokerSettings.name));
})

io.on("set-smoker-name", (socket) => {

});

io.on("set-probe-name", (socket) => {
    if (socket.data.probeId && socket.data.probeName && S.sample(probes).some(p => p.id == socket.data.probeId)) {
        probes().find(p => p.id == socket.data.probeId).name = socket.data.probeName;
        probes(S.sample(probes));
        socket.emit("probe-name-set", S.sample(probes).find(p => p.id == socket.data.probeId));
    } 
    else if (!S.sample(probes).some(p => p.id == socket.data.probeId)) socket.emit("unknown-probe", false);
});

io.on("set-target-value", (socket) => {
    if (socket.data.probeId && socket.data.targetValue && S.sample(probes).some(p => p.id == socket.data.probeId)) {
        if ((<number>socket.data.targetValue) <= S.sample(smokerSettings.maxTargetTemp) && (<number>socket.data.targetValue) > 0){
            S.sample(probes).find(p => p.id == socket.data.probeId).targetValue = socket.data.targetValue;
            probes(S.sample(probes));
            socket.emit("probe-targeValue-set", S.sample(probes).find(p => p.id == socket.data.probeId));
        }
        else {
            socket.emit("probe-targetValue-outofrange", S.sample(probes).find(p => p.id == socket.data.probeId));
        }
    }
    else if (!S.sample(probes).some(p => p.id == socket.data.probeId)) socket.emit("unknown-probe", false);
});

// app.use(session({
//     store: new RedisStore({
//         url: redisConfig.url,
//     }),
//     secret: "adk3SPVD%Y@8nvpA&dvVMY!9JmpTKoiyE5bk8^6wk#%gQKfYe4^BNZKC%VMayhd2sar%Hbgg!$Sa",
//     resave: false,
//     saveUninitialized: false,
// }));
registerIpAuth(passport);
app.use(passport.initialize());
registerPassportAuth(passport);
// app.use(passport.session());

app.use("/api", router)

app.get("/", passport.authenticate('ip', {session: false}), (req, res) => {
    res.status(200).send({
        greeting: "Hello",
        subject: (<{id: string, provider: string, displayName: string}>req.user).id,
    });
});

router.use(passport.authenticate('ip', {session: false}));

router.route("/probes").get((req, res) => {
    res.status(200).send(S.sample(probes));
});

router.route("/probes/maxtargettemp").get((req, res) => {
    res.status(200).send(S.sample(smokerSettings.maxTargetTemp).toString());
});

router.route("/probes/:probe").get((req, res) => {
    if (!S.sample(probes).some(p => p.id == req.params.probe)) {
        res.status(404).send("no probe by that id");
    }
    else {
        res.status(200).send(
            {[req.params.probe]: S.sample(probes).find(p => p.id == req.params.probe)}
        );
    }
});

router.route("/probes/:probe/target/:value").get((req, res) => {
    if (!S.sample(probes).some(p => p.id == req.params.probe)) {
        res.status(404).send("no probe by that id");
    }
    else if (parseFloat(req.params.value) > S.sample(smokerSettings.maxTargetTemp) || parseFloat(req.params.value) < 0) {
        res.status(400).send(`target temperature must be below ${S.sample(smokerSettings.maxTargetTemp)} and above 0`);
    }
    else {
        S.sample(probes).find(p => p.id == req.params.probe).targetValue = parseFloat(req.params.value);
        probes(S.sample(probes));
        res.status(200).send({[req.params.probe]: S.sample(probes).find(p => p.id == req.params.probe)});
    }
});

router.route("/probes/:probe/name/:value").get((req, res) => {
    if (!S.sample(probes).some(p => p.id == req.params.probe)) {
        res.status(404).send("no probe by that id");
    }
    else {
        S.sample(probes).find(p => p.id == req.params.probe).name = req.params.value;
        probes(S.sample(probes));
        res.status(200).send({[req.params.probe]: S.sample(probes).find(p => p.id == req.params.probe)});
    }
});

router.route("/heating").get((req, res) => {
    res.status(200).send(S.sample(heating).status);
});

router.route("/server/version").get((req, res) => {
    console.log("version: ", version);
    res.status(200).send(version);
});

router.route("/server/ip").get((req, res) => {
    console.log("ip: ", ip.address());
    res.status(200).send(ip.address());
});

router.route("/server/name").get((req, res) => {
    console.log("name: ", S.sample(smokerSettings.name));
    res.status(200).send(S.sample(smokerSettings.name));
});

router.route("/server/name/:name").get((req, res) => {
    smokerSettings.name(req.params.name);
    res.status(200).send(S.sample(smokerSettings.name));
});

router.route("/server/settings/createdefault").get(async (req, res) => {
    if (!fs.existsSync(defaultSettingsPath)) {
        console.log("creating default config.");
        res.status(200).send(await createDefaults(defaultSettingsPath));
        setup(global.settings.settingsPath, defaultSettingsPath);
    }
});

router.route("/server/settings/wifi/scan").get(async (req, res) => {
    res.status(200).send(await scanForNetworks());
});

router.route("/server/settings/wifi/knownnetworks").get(async (req, res) => {
    res.status(200).send(await listKnownNetworks());
});

router.route("/server/settings/wifi/connect").post(async (req, res) => {
    
});

httpServer.listen(
    PORT,
    () => {
        console.log(`Ready at http://localhost:${PORT}`);
        ad.start();
    }
);

const shutdown = () => {
    clearGPIO();
    httpServer.close();
    setTimeout(() => process.exit(0), 3000);
}

process.on("SIGHUP", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGCONT", shutdown);