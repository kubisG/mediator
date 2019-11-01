import { BrokerService } from "./broker.service";
import { RecalculateMiddleware } from "./message-middlewares/recalculate.middleware";
import { MessagesRouter } from "../messages/routing/messages-router";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { OrderStatusMiddleware } from "../messages/message-middlewares/order-status.middleware";
import { AvgPxMiddleware } from "./message-middlewares/avg-px.middleware";
import { PlacedMiddleware } from "../messages/message-middlewares/placed.middleware";
import { CancelFillMiddleware } from "./message-middlewares/cancel-fill.middleware";
import { CancelRejectMiddleware } from "../messages/message-middlewares/cancel-reject.middleware";
import { SaveMessageBrokerMiddleware } from "./message-middlewares/save-message-broker.middleware";
import { FilterMiddleware } from "../messages/message-middlewares/filter.middleware";
import { AckMiddleware } from "../messages/message-middlewares/ack.middleware";
import { ResendMessageMiddleware } from "../messages/message-middlewares/resend-message.middleware";
import { SleuthMiddleware } from "./message-middlewares/sleuth.middleware";
import { ReplaceTreeMiddleware } from "./message-middlewares/replace-tree.middleware";
import { PhoneMessageMiddleware } from "./message-middlewares/phone-message.middleware";
import { AcceptPhoneMessageMiddleware } from "./message-middlewares/accept-phone-message.middleware";
import { AcceptNewMessageMiddleware } from "./message-middlewares/accept-new-message.middleware";
import { TransactTimeMiddleware } from "../messages/message-middlewares/transact-time.middleware";
import { DeQueueMiddleware } from "../messages/message-middlewares/dequeue.middleware";
import { QueueMiddleware } from "../messages/message-middlewares/queue.middleware";

export const inMessageMiddlewares = [
    QueueMiddleware,
    SleuthMiddleware,
    RecalculateMiddleware,
    PlacedMiddleware,
    CancelRejectMiddleware,
    SaveMessageBrokerMiddleware,
    AckMiddleware,
    AcceptNewMessageMiddleware,
    AcceptPhoneMessageMiddleware,
    DeQueueMiddleware,
];

export const outMessageMiddlewares = [
    QueueMiddleware,
    ReplaceTreeMiddleware,
    RecalculateMiddleware,
    OrderStatusMiddleware,
    CancelFillMiddleware,
    AvgPxMiddleware,
    TransactTimeMiddleware,
    ResendMessageMiddleware,
    SaveMessageBrokerMiddleware,
    PhoneMessageMiddleware,
    FilterMiddleware,
    DeQueueMiddleware,
];

export const brokerProviders = [
    {
        provide: "brokerOrderService",
        useFactory: async (
            ordersService: BrokerService,
        ): Promise<BrokerService> => {
            await ordersService.saveConsumedMessages();
            return ordersService;
        },
        inject: [
            BrokerService,
        ],
    },
    {
        provide: "inMiddlewaresInit",
        useFactory: (
            brokerRouting: MessagesRouter,
            ...inMiddlewares: MessageMiddleware[]
        ) => {
            brokerRouting.setInMiddlewares(inMiddlewares);
        },
        inject: [
            "brokerRouting",
            ...inMessageMiddlewares,
        ],
    },
    {
        provide: "outMiddlewaresInit",
        useFactory: (
            brokerRouting: MessagesRouter,
            ...outMiddlewares: MessageMiddleware[]
        ) => {
            brokerRouting.setOutMiddlewares(outMiddlewares);
        },
        inject: [
            "brokerRouting",
            ...outMessageMiddlewares,
        ],
    },
];
