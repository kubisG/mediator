export interface Manifest {

    getAppId(): string;
    getUrl(): string;
    getName(): string;
    getIcon(): string;
    getDescription(): string;
    getVersion(): string;
    getArguments(): string[];

}
