declare module "pi-wifi" {
    export interface ScanNetwork {
        bssid: string,
        frequency: number,
        signalLevel: number,
        flags: string,
        ssid: string,
    }
    export interface ListNetwork {
        network_id: number,
        ssid: string,
        bssid: string,
        flags: string,
    }
    export interface ConnectionCheck {
        selected: boolean,
        connected: boolean,
        ip?: string
    }
    export interface NetworkDetails {
        key_mgmt?: string,
        ssid: string,
        username?: string,
        password?: string,
        eap?: string,
        phase1?: string,
        phase2?: string,
    }
    export interface Status {
        bssid: string,
        frequency: number,
        mode: string,
        key_mgmt: string,
        ssid: string,
        pairwise_cipher: string,
        group_cipher: string,
        p2p_device_address: string,
        wpa_state: string,
        ip: string,
        mac: string,
        uuid: string,
        id: number
    }

    /**
    * @method checkConnection
    * @description Returns the state of the network with the specified ssid
    * @param {string} ssid Network ssid
    * @param {(err: Error, result: ConnectionCheck) => void} callback if unable to get network status, Object with connection details
    * {
    *   selected: true | false,
    *   connected: true | false,
    *   ip: 192.168.0.2
    * }
    */
    declare function checkConnection(ssid: string, callback: (err: Error, result: ConnectionCheck) => void): void;
    /**
    * @method connection
    * @description Connects to a network with the parameters specified (This can connect to open and secure networks including EAP 802.1x)
    * @param {Object} details Network details
    * - {string} key_mgmt You can specify the type of security to use. (Optional)
    * - {string} ssid (Optional, required for secure and enterprise networks)
    * - {string} username (Optional, required for enterprise networks)
    * - {string} password (Optional, required for secure or enterprise networks)
    * @param {(error: Error) => void} callback Returns error if the network creation isn't successful
    */
    declare function connection(details: NetworkDetails, callback: (error: Error) => void): any;
    /**
    * @method connectToId
    * @description Enables a network, saves the configuration and selects the network with the id provided
    * @param {Number} networkId Network id
    * @param {(error: Error) => void} callback Returns error if the process fails
    */
    export function connectToId(networkId: Number, callback: (error: Error) => void): void;
    /**
    * @method secureConnection
    * @description Connects to a network with the ssid specified using the password provided
    * @param {string} ssid Network ssid
    * @param {string} ssid Network psk
    * @param {(error: Error) => void} callback Returns error if the connection isn't successful
    */
    declare function secureConnection(ssid: string, password: string, callback: (error: Error) => void): void;
    /**
    * @method openConnection
    * @description Connects to an open network with the ssid specified
    * @param {string} ssid Network ssid
    * @param {(error: Error) => void} callback Returns error if the connection isn't successful
    */
    declare function openConnection(ssid: string, callback: (error: Error) => void): void;
    /**
    * @method enterpriseConnection
    * @description Connects to a network with the ssid specified using the password provided
    * @param {string} ssid Network ssid
    * @param {string} username User/identity to use on authentication
    * @param {string} password Password to use on authentication
    * @param {(error: Error) => void} callback Returns error if the connection isn't successful
    */
    declare function enterpriseConnection(ssid: string, username: string, password: string, callback: (error: Error) => void): void;
    /**
     * @method disconnect
     * @description Disconnects from the network on the current interface
     * @param {(error: Error) => void} callback (err) returns err if the process fails
     */
    export function disconnect(callback: (error: Error) => void): void;
    /**
     * @method detectSupplicant
     * @description Looks for a running wpa_supplicant process and if so returns the config file and interface used
     * @param {(error: Error, iface: string, configFile: string) => void} callback (err, iface, configFile) Error if the process failed or no supplicant is running, Interface used, Config file used
     */
    export function detectSupplicant(callback: (error: Error, iface: string, configFile: string) => void): void;
    /**
     * @method interfaceDown
     * @description Drops the interface provided
     * @param {string} iface Interface to stop
     * @param {(error: Error) => void} callback (err) Returns an error if the process fails
     */
    export function interfaceDown(iface: string, callback: (error: Error) => void): void;
    /**
     * @method interfaceUp
     * @description Raises the interface provided
     * @param {string} iface Interface to start
     * @param {(error: Error) => void} callback (err) Returns an error if the process fails
     */
    export function interfaceUp(iface: string, callback: (error: Error) => void): void;
    /**
     * @method disableSupplicant
     * @description Kills the supplicant process for the specified interface
     * @param {string} iface Interface used by supplicant (If not iface is supplied the current one will be used)
     * @param {(error: Error) => void} callback (err) returns err if unable to kill the process
     */
    declare function disableSupplicant(iface: string, callback: (error: Error) => void): void;
    /**
     * @method listNetworks
     * @description List the networks in an array, each network has Network ID, SSID, BSSID and FLAGS
     * @param {(error: Error, networksArray: ListNetwork[]) => void} callback (err, networksArray) returns err if the process fails, each network is a Json object that contains network_id, ssid, bssid and flags
     */
    export function listNetworks(callback: (error, networksArray: ListNetwork[]) => void): void;
    /**
     * @method restartInterface
     * @description Restarts the interface provided
     * @param {string} iface Interface to restart
     * @param {(error: Error) => void} callback (err) Returns an error if the process fails
     */
    export function restartInterface(iface: string, callback: (error: Error) => void): void;
    /**
    * @method scan
    * @description scan available wifi networks
    * @param {(error, data: ScanNetwork[]) => void} callback
    * @return {Array[Object]}
    */
    export function scan(callback: (error: Error, data: ScanNetwork[]) => void): any[][any];
    /**
    * @method setCurrentInterface
    * @description Specify the interface to use
    * @param {string} iface Intertface to set
    * @param {(error: Error) => void} callback Returns error if unable to set the interface
    */
    export function setCurrentInterface(iface: string, callback: (error: Error) => void): void;
    /**
     * @method startSupplicant
     * @description Starts a wpa_supplicant instance
     * @param {object} options Json object where the interface, config file and dns file to use can be specified, otherwhise default values will be selected
     * - iface: Interface to use. Defaults to the currently selected one
     * - config: Configuration file for the supplicant file. Defaults to /etc/wpa_supplicant/wpa_supplicant.conf
     * - dns: DNS file to use. Defaults to /etc/resolv.conf
     * @param {(error: Error) => void} callback (err) Error if the process fails
     */
    export function startSupplicant(options: object, callback: (error: Error) => void): void;
    /**
    * @method status
    * @description Show status parameters of the interface specified, if no interface is provided the selected one is used
    * @param {string} iface Interface to get status from. (If not provided it defaults to the currently selected one)
    * @param {(error: Error, status: Status) => void} callback Returns error if the process fails, status JSON object with the interface status
    * @example
    *
    * status('wlan0', function(err, status){
    *   if(!err) console.log(status);
    * });
    * // =>
    * {
    *   bssid: '2c:f5:d3:02:ea:d9',
    *   frequency: 2412,
    *   mode: 'station',
    *   key_mgmt: 'wpa2-psk',
    *   ssid: 'Fake-Wifi',
    *   pairwise_cipher: 'CCMP',
    *   group_cipher: 'CCMP',
    *   p2p_device_address: 'e4:28:9c:a8:53:72',
    *   wpa_state: 'COMPLETED',
    *   ip: '10.34.141.168',
    *   mac: 'e4:28:9c:a8:53:72',
    *   uuid: 'e1cda789-8c88-53e8-ffff-31c304580c1e',
    *   id: 0
    * }
    */
    export function status(iface: string, cb: (error: Error, status: Status) => void): void;
    export { checkConnection as check, connection as connectTo, secureConnection as connect, openConnection as connectOpen, enterpriseConnection as connectEAP, disableSupplicant as killSupplicant };
}
