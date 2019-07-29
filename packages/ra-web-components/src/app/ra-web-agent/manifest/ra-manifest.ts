import { Manifest } from "./manifest.interface";
import { VoidManifest } from "./void-manifest";
import { OpenFinManifest } from "./openfin-manifest";

export class RaManifest implements Manifest {

    private manifest: Manifest;

    constructor(manifest: any) {
        this.manifestFactory(manifest);
    }

    private manifestFactory(manifest: any) {
        if (manifest.startup_app) {
            this.manifest = new OpenFinManifest(manifest);
        } else {
            this.manifest = new VoidManifest(manifest);
        }
    }

    getAppId(): string {
        return this.manifest.getAppId();
    }

    getUrl(): string {
        return this.manifest.getUrl();
    }

    getName(): string {
        return this.manifest.getName();
    }

    getIcon(): string {
        return this.manifest.getIcon();
    }

    getDescription(): string {
        return this.manifest.getDescription();
    }

    getVersion(): string {
        return this.manifest.getVersion();
    }

    getArguments(): string[] {
        return this.manifest.getArguments();
    }

}
