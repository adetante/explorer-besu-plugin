import { IPlugin, ILogger, IPluginApi } from "plugin-api";
import { BesuPluginConfig } from "./BesuPluginConfig";
import { AuthAdapter } from "./adapter/auth/AuthAdapter";
import { AuthStore } from "./AuthStore";
import { renderLoginForm } from "./component/Auth";

const plugin: IPlugin = {
    init(configData: unknown, api: IPluginApi, logger: ILogger, publicPath) {
        __webpack_public_path__ = publicPath;

        const config = new BesuPluginConfig().fromJson(configData as any);
        const authStore = new AuthStore(config.getLoginUrl(), logger);
        const adapter = new AuthAdapter(authStore);

        if ( config.getLoginUrl().startsWith("http://") && !config.isAllowedUnsecuredAuthentication()) {
                logger.error("Unsecured authentication disabled and loginUrl is HTTP!");
        } else {
            api.addDataAdapter("adapter://adetante/besu/auth-store", adapter);

            if (!authStore.isAuthenticated) {
                renderLoginForm(authStore);
            }
        }
    },

    getAvailableLocales() {
        return ["en-US"];
    },

    async loadTranslations(locale: string) {
        return await import("./translation/" + locale + ".json");
    }
};

// tslint:disable-next-line:no-default-export
export default plugin;

export const manifest = __plugin_manifest__;
