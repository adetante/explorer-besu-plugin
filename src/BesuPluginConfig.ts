export interface IConfigData {
    /**
     * URL of the Besu login endpoint, for example: https://node:8545/login
     * see https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication
     */
    loginUrl: string;
    /**
     * If true, allow authentication on HTTP endpoints.
     * Default value is false and only HTTPS authentication endpoints are allowed.
     */
    allowUnsecuredAuthentication?: boolean;
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

    isAllowedUnsecuredAuthentication() {
        return this.data.allowUnsecuredAuthentication || false;
    }
}
