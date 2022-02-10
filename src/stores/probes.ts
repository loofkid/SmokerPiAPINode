import S, { DataSignal } from "s-js";

export class Probe {
    id: string;
    name: string;
    defaultName: string;
    currentValue: number;
    targetValue: number;
    connected: boolean;
}

export const probes: DataSignal<Probe[]>  = S.data([
    {
        id: "chamberProbe",
        name: "Chamber",
        defaultName: "Chamber",
        currentValue: 75,
        targetValue: 0,
        connected: false,
    },
    {
        id: "probe1",
        name: "Probe 1",
        defaultName: "Probe 1",
        currentValue: 75,
        targetValue: 0,
        connected: false,
    },
    {
        id: "probe2",
        name: "Probe 2",
        defaultName: "Probe 2",
        currentValue: 75,
        targetValue: 0,
        connected: false,
    },
    {
        id: "probe3",
        name: "Probe 3",
        defaultName: "Probe 3",
        currentValue: 75,
        targetValue: 0,
        connected: false,
    },
    {
        id: "probe4",
        name: "Probe 4",
        defaultName: "Probe 4",
        currentValue: 75,
        targetValue: 0,
        connected: false,
    },
]);

S(() => {
    if (global.settings?.nconf) {
        const nconf = global.settings.nconf;
        if (S.sample(probes).some(probe => {
            const storedProbe = (<Settings.Probe[]>nconf.get("probes")).find(p => p.id == probe.id);
            probe.name != storedProbe.name;
            probe.targetValue != storedProbe.targetValue;
        })) {
            nconf.set("probes", probes().map(probe => {return { id: probe.id, defaultName: probe.defaultName, targetValue: probe.targetValue }}));
            nconf.save((error) => {
                if (error) console.error(error);
                else console.log("updated saved probes.");
            });
        }
    }
})