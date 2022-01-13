import { PluginModule } from "paella-core";
import packageData from "../../package.json";

export default class SlidePluginsModule extends PluginModule {
    get moduleName() {
        return "paella-slide-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}