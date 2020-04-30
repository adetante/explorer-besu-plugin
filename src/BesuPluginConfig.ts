export interface IConfigData {
    /**
     * URL of the Besu login endpoint, for example: https://node:8545/login
     * see https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication
     */
    loginUrl: string;
}

export class BesuPluginConfig {
    private data: IConfigData;

    fromJson(data: IConfigData) {
        this.data = data;
        return this;
    }

    getLoginUrl() {
        return this.data.loginUrl;
    }
}
