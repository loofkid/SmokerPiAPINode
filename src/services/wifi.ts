import wifi, { scan, connectTo, NetworkDetails, ConnectionCheck, ScanNetwork, ListNetwork, Status } from 'pi-wifi';

export const scanForNetworks = () => {
    return new Promise<ScanNetwork[]>((resolve, reject) => {
        wifi.scan((err, networks) => {
            if (err) reject(err);
            resolve(networks);
        });
    });
};

export const listKnownNetworks = () => {
    return new Promise<ListNetwork[]>((resolve, reject) => {
        wifi.listNetworks((err, networks) => {
            if (err) reject(err);
            resolve(networks);
        });
    });
}

export const checkNetworkConnection = (ssid: string) => {
    return new Promise<ConnectionCheck>((resolve, reject) => {
        wifi.check(ssid, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export const connectToNetwork = (networkDetails: NetworkDetails) => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.connectTo(networkDetails, (err) => {
            if (err) reject(err);
            setTimeout(() => {
                wifi.check(networkDetails.ssid, (err, status) => {
                    if (!err && status.connected) {
                        resolve(true);
                    }
                    else {
                        reject(err);
                    }
                });
            }, 2000);
        });
    });
}

export const connectToKnownNetwork = (id: number) => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.connectToId(id, (error) => {
            if (error) reject(error);
            resolve(true);
        });
    });
}

export const disconnectFromNetwork = () => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.disconnect((err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

export const wifiOff = (ifName: string) => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.interfaceDown(ifName, (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

export const wifiOn = (ifName: string) => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.interfaceUp(ifName, (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

export const wifiRestart = (ifName: string) => {
    return new Promise<boolean>((resolve, reject) => {
        wifi.restartInterface(ifName, (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

export const wifiStatus = (ifName: string) => {
    return new Promise<Status>((resolve, reject) => {
        wifi.status(ifName, (err, status) => {
            if (err) reject(err);
            resolve(status);
        });
    });
}