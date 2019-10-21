import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { entityProviders } from "./repository.provider";
import { LocatesUpdateSubscriber } from "./subscribers/locates-update.subscriber";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        EnvironmentsModule,
    ],
    controllers: [
    ],
    providers: [
        ...entityProviders,
        LocatesUpdateSubscriber,
    ],
    exports: [
        ...entityProviders,
        LocatesUpdateSubscriber,
    ],
})
export class FormsDaoModule {
    constructor() { }
}
