import S, { DataSignal } from "s-js";

export class SmokerSettings {
    constructor() {
        this.name = S.data(null);
        this.uid = "";
        this.maxTargetTemp = S.data(null);
    }
    private _uid: string;


    name: DataSignal<string>;

    public get uid() : string {
        return this._uid;
    }
    public set uid(v: string) {
        this._uid = v;
    }
    
    maxTargetTemp: DataSignal<number>;
}

export const smokerSettings = new SmokerSettings();
Object.seal(smokerSettings);

S.on(() => smokerSettings.name(), () => {
    if (global.settings?.nconf) {
        const nconf = global.settings.nconf;
        nconf.set("smoker:name", smokerSettings.name());
        nconf.save((error) => {
            if (error) console.error(error);
            else console.log("changed smoker name to: ", smokerSettings.name());
        });
    }
});

S(() => {
    if (global.settings?.nconf) {
        const nconf = global.settings.nconf;
        nconf.set("smoker:maxTargetTemp", smokerSettings.maxTargetTemp());
        nconf.save((error) => {
            if (error) console.error(error);
            else console.log("updated maxTargetTemp to: ", smokerSettings.maxTargetTemp());
        });
    }
});