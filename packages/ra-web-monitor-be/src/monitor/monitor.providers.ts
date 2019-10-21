import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { OutMiddleware } from "./middlewares/out.middleware";
import { InMiddleware } from "./middlewares/in.middleware";
import { FieldsInMiddleware } from "./middlewares/fields-in.middleware";

export const inMessageMiddlewares = [
    InMiddleware,
    FieldsInMiddleware,
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
