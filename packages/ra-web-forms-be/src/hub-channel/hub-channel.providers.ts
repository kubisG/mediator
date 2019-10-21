import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { OutMiddleware } from "./middlewares/out.middleware";
import { InMiddleware } from "./middlewares/in.middleware";

export const inMessageMiddlewares = [
    InMiddleware,
];

export const outMessageMiddlewares = [
    OutMiddleware,
];

export const inMiddlewaresProvider = {
    provide: "inMiddlewares",
    useFactory: (
        ...inMiddlewares: MessageMiddleware[]
    ) => {
        return inMiddlewares;
    },
    inject: [
        ...inMessageMiddlewares,
    ],
};

export const outMiddlewaresProvider = {
    provide: "outMiddlewares",
    useFactory: (
        ...outMiddlewares: MessageMiddleware[]
    ) => {
        return outMiddlewares;
    },
    inject: [
        ...outMessageMiddlewares,
    ],
};
