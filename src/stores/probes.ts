export interface Probe {
    id: string;
    name: string;
    currentValue: number;
    targetValue: number;
    connected: boolean;
    channel: number;
    address: number;
}

export const probes: {[name: string]: Probe} = {
    chamberProbe: {
        id: "chamberProbe",
        name: "Chamber",
        currentValue: 75,
        targetValue: 0,
        connected: false,
        channel: 1,
        address: 0x48,
    },
    probe1: {
        id: "probe1",
        name: "Probe 1",
        currentValue: 75,
        targetValue: 0,
        connected: false,
        channel: 2,
        address: 0x48,
    },
    probe2: {
        id: "probe2",
        name: "Probe 2",
        currentValue: 75,
        targetValue: 0,
        connected: false,
        channel: 3,
        address: 0x48,
    },
    probe3: {
        id: "probe3",
        name: "Probe 3",
        currentValue: 75,
        targetValue: 0,
        connected: false,
        channel: 0,
        address: 0x49,
    },
    probe4: {
        id: "probe4",
        name: "Probe 4",
        currentValue: 75,
        targetValue: 0,
        connected: false,
        channel: 1,
        address: 0x49,
    },
};
export const maxTargetTemp = 275;