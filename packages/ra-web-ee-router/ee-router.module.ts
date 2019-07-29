import { Module } from "@nestjs/common";

const inMiddlewaresProvider = {
    provide: "inMiddlewares",
    useFactory: () => {
        return [];
    }
};
const outMiddlewaresProvider = {
    provide: "outMiddlewares",
    useFactory: () => {
        return [];
    }
};

@Module({
    providers: [
        inMiddlewaresProvider,
        outMiddlewaresProvider
    ],
    exports: [
        inMiddlewaresProvider,
        outMiddlewaresProvider
    ]
})
export class EERouterModule { }
