import { Eth } from "web3-eth";
import { observable } from "mobx";
import { ILogger } from "plugin-api";

export interface IAuthStore {
    isAuthenticated: boolean;
    applyLoginInfo(web3Eth: Eth): void;
}

interface ICredentials {
    username: string;
    password: string;
}

export class AuthStore implements IAuthStore {
    private credentials: ICredentials;
    private token: string;
    private refreshInterval: any;
    private currentWeb3Provider: any;
    @observable
    isAuthenticated: boolean;

    constructor(private loginUrl: string, private logger: ILogger) {}

    applyLoginInfo(web3Eth: Eth) {
        this.currentWeb3Provider = web3Eth.currentProvider as any;
        this.applyHeaders();
    }

    async authenticate(credentials: ICredentials): Promise<boolean> {
        const success = this.getNewToken(credentials);
        if (success) {
            this.credentials = credentials;
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
            this.refreshInterval = setInterval(() => {
                this.getNewToken(this.credentials)
                    .then(() => this.applyHeaders())
                    .catch((err) => this.logger.error("Cannot renew jwt token", err));
            }, 1000 * 60 * 4); // refresh token every 4 minutes
        }
        return success;
    }

    private applyHeaders() {
        if (this.currentWeb3Provider) {
            this.currentWeb3Provider.headers = [{
                name: "Authorization",
                value: `Bearer ${this.token}`
            }];
        }
    }

    private getNewToken(credentials: ICredentials): Promise<boolean> {
        return fetch(this.loginUrl, {
            method: "POST",
            body: JSON.stringify(credentials)
        })
        .then((response) => response.json())
        .then(({ token }) => {
            this.token = token;
            this.isAuthenticated = true;
            return true;
        })
        .catch(() => false);
    }
}
