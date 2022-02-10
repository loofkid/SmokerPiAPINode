declare namespace Settings {
    interface Settings {
        smoker: Settings.Smoker;
        probes: Settings.Probe[];
    }
    interface Smoker {
        name: string,
        uid: string,
        maxTargetTemp: number,
    }
    interface Probe {
        id: string,
        defaultName: string,
        name: string,
        targetValue: number,
    }
}

declare global {
    interface settings {
        uidNamespace: string;
        settingsPath: string;
    }
}