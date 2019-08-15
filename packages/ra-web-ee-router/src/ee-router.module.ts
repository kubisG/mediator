import { Module } from "@nestjs/common";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";

const inMiddlewaresProvider = {
    provide: "inMiddlewares",
    useFactory: (): MessageMiddleware[] => {
        return [];
    }
};
const outMiddlewaresProvider = {
    provide: "outMiddlewares",
    useFactory: (): MessageMiddleware[] => {
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
