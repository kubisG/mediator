import { Manifest } from "./manifest.interface";

export class VoidManifest implements Manifest {

    constructor(private manifest: any) {

    }

    getAppId(): string {
        throw new Error("Method not implemented.");
    }

    getUrl(): string {
        throw new Error("Method not implemented.");
    }

    getName(): string {
        throw new Error("Method not implemented.");
    }

    getIcon(): string {
        throw new Error("Method not implemented.");
    }

    getDescription(): string {
        throw new Error("Method not implemented.");
    }

    getVersion(): string {
        throw new Error("Method not implemented.");
    }

    getArguments(): string[] {
        throw new Error("Method not implemented.");
    }

}
