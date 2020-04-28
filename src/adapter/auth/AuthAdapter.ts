import { IDataAdapter } from "plugin-api/IDataAdapter";
import { IAuthStore, AuthStore } from "../../AuthStore";

export class AuthAdapter implements IDataAdapter<{}, IAuthStore> {
    contextType = {};
    constructor(private authStore: AuthStore) {}
    async load(contextType: any) {
        return this.authStore;
    }
}
