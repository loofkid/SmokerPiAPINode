import { createClient } from "redis"
import S from "s-js";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { probes } from "./stores/probes";
import { smokerSettings } from "./stores/smoker-settings";
import nconf from "nconf";
import { v5 as uuidv5 } from 'uuid';
import fs from 'fs-extra';

export const redisSetup = async (redisClient: ReturnType<typeof createClient>) => {
    
}

export const setup = (settingsPath: string, defaultSettingsPath: string) => {
    if (fs.existsSync(settingsPath)) {
        nconf.file('file', { file: settingsPath });
        nconf.add('default', { type: 'file', file: defaultSettingsPath });
        nconf.load();
        const storedSmokerSettings = (<Settings.Smoker>nconf.get('smoker'));
        smokerSettings.name(storedSmokerSettings.name);
        smokerSettings.uid = storedSmokerSettings.uid;
        smokerSettings.maxTargetTemp(storedSmokerSettings.maxTargetTemp);

        const storedProbes = (<Settings.Probe[]>nconf.get('probes'));
        probes().forEach(probe => {
            probe = {...probe, ...(storedProbes.find(p => p.id == probe.id))};
        });
        probes(S.sample(probes));
        global.settings.nconf = nconf;
    }
    else {
        fs.ensureFileSync(settingsPath);
        fs.writeFileSync(settingsPath, "{}");
        nconf.file('file', { file: settingsPath });
        nconf.add('default', { type:'file', file: defaultSettingsPath });
        nconf.load();
        nconf.set("smoker:name", uniqueNamesGenerator({dictionaries: [adjectives, colors, animals], separator: "-"}));
        nconf.set("smoker:uid", uuidv5(nconf.get("smoker:name"), global.settings.uidNamespace));
        nconf.save((error) => {
            if (error) console.error(error);
            else console.log("saved first config.");
        });
        global.settings.nconf = nconf;
    }
}

export const createDefaults = async (defaultSettingsPath: string) => {
    fs.ensureFileSync(defaultSettingsPath);
    fs.writeFileSync(defaultSettingsPath, "{}");
    nconf.file('default', { file: defaultSettingsPath }).load();
    nconf.set("smoker:name", "");
    nconf.set("smoker:uid", "");
    nconf.set("smoker:maxTargetTemp", 275);
    nconf.set("probes", S.sample(probes).map(probe => {return { id: probe.id, defaultName: probe.defaultName, targetValue: probe.targetValue }}));
    return new Promise<Settings.Settings>((resolve, reject) => {
        nconf.save((error: Error) => {
            if (error) reject(error);
            resolve(JSON.parse(fs.readFileSync(defaultSettingsPath, 'utf8')));
        });
    });
}