import { Manifest } from "./manifest.interface";

export class OpenFinManifest implements Manifest {

    constructor(private manifest: any) {

    }

    getAppId(): string {
        return this.manifest.startup_app.uuid;
    }

    getUrl(): string {
        return this.manifest.startup_app.url;
    }

    getName(): string {
        return this.manifest.startup_app.name;
    }

    getIcon(): string {
        return this.manifest.startup_app.icon;
    }

    getDescription(): string {
        return this.manifest.startup_app.description;
    }

    getVersion(): string {
        return this.manifest.runtime.version;
    }

    getArguments(): string[] {
        return this.manifest.runtime.arguments.split(" ");
    }

}
