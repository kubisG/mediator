import { TraderService } from "./trader.service";
import { OrderStatusMiddleware } from "../messages/message-middlewares/order-status.middleware";
import { MessagesRouter } from "../messages/routing/messages-router";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { CancelRejectMiddleware } from "../messages/message-middlewares/cancel-reject.middleware";
import { FilterMiddleware } from "../messages/message-middlewares/filter.middleware";
import { SaveMessageTraderMiddleware } from "./message-middlewares/save-message-trader.middleware";
import { MessageBasicsMiddleware } from "./message-middlewares/message-basics.middleware";
import { CancelFillMiddleware } from "./message-middlewares/cancel-fill.middleware";
import { AckMiddleware } from "../messages/message-middlewares/ack.middleware";
import { ResendMessageMiddleware } from "../messages/message-middlewares/resend-message.middleware";
import { PhoneMessageMiddleware } from "./message-middlewares/phone-message.middleware";
import { PlacedMiddleware } from "../messages/message-middlewares/placed.middleware";
import { TransactTimeMiddleware } from "../messages/message-middlewares/transact-time.middleware";
import { QueueMiddleware } from "../messages/message-middlewares/queue.middleware";
import { DeQueueMiddleware } from "../messages/message-middlewares/dequeue.middleware";

export const inMessageMiddlewares = [
    QueueMiddleware,
    CancelFillMiddleware,
    OrderStatusMiddleware,
    CancelRejectMiddleware,
    SaveMessageTraderMiddleware,
    AckMiddleware,
    DeQueueMiddleware,
];

export const outMessageMiddlewares = [
    QueueMiddleware,
    MessageBasicsMiddleware,
    PlacedMiddleware,
    TransactTimeMiddleware,
    ResendMessageMiddleware,
    SaveMessageTraderMiddleware,
    PhoneMessageMiddleware,
    FilterMiddleware,
    DeQueueMiddleware,
];

export const traderProviders = [
    {
        provide: "traderOrderService",
        useFactory: async (
            ordersService: TraderService,
        ): Promise<TraderService> => {
            await ordersService.saveConsumedMessages();
            return ordersService;
        },
        inject: [
            TraderService,
        ],
    },
    {
        provide: "inMiddlewaresInit",
        useFactory: (
            traderRouting: MessagesRouter,
            ...inMiddlewares: MessageMiddleware[]
        ) => {
            traderRouting.setInMiddlewares(inMiddlewares);
        },
        inject: [
            "traderRouting",
            ...inMessageMiddlewares,
        ],
    },
    {
        provide: "outMiddlewaresInit",
        useFactory: (
            traderRouting: MessagesRouter,
            ...outMiddlewares: MessageMiddleware[]
        ) => {
            traderRouting.setOutMiddlewares(outMiddlewares);
        },
        inject: [
            "traderRouting",
            ...outMessageMiddlewares,
        ],
    },
];
