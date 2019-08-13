import { Test, TestingModule } from "@nestjs/testing";
import { Subscription } from "rxjs/internal/Subscription";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { MessageValidatorService } from "../../../src/validators/message-validator.service";

describe("UserSessionData", () => {
    let app: TestingModule;
    let service: MessageValidatorService;
    const subscriptions: Subscription[] = [];

    const filter = {
        "Trader-NewOrderSingle": {
            required: [
                "msgType",
                "Currency",
                "RaID"
            ],
            optional: [
                "Limit",
                "Account",
                "SecurityDesc",
                "SettlDate",
                "ExpireDate",
                "Price",
                "CumQty",
                "OrdType",
                "OnBehalfOfSubID",
                "ExecInst",
                "DeliverToSubID",
                "Text",
                "OrderCapacity",
                "OrigClOrdID",
                "DeliverToCompID",
                "OnBehalfOfCompID",
                "ClOrdLinkID",
                "LeavesQty",
                "LocateReqd",
                "OddLot",
                "SecurityID",
                "SecurityIDSource",
                "ClientID",
                "StopPx",
                "TargetCompID",
                "Commission",
                "CommType"
            ]
        },
        "Trader-OrderCancelRequest": {
            required: [
                "msgType",
                "OrderQty",
                "RequestType",
                "RaID"
            ],
            optional: [
                "TransactTime",
                "OrderID",
                "ClOrdID",
                "ClOrdLinkID",
                "OrigClOrdID",
                "DeliverToSubID",
                "OnBehalfOfSubID",
                "Side",
                "Symbol",
                "ClientID",
                "SenderCompID",
                "TargetCompID"
            ]
        },
        "AllocRow-AllocationInstruction": {
            required: [
                "AllocShares",
                "AllocAccount"
            ],
            optional: [
                "AllocText"
            ]
        }
    };

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                MessageValidatorService,
                {
                    provide: EnvironmentService,
                    useClass: EnvironmentMockService,
                }
            ],
        }).compile();
        service = app.get<MessageValidatorService>(MessageValidatorService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    describe("isMessageValid()", () => {
        it("should return invalid isMessageValid", async () => {
            const token = "AAAAA";
            service.setFilter(filter);
            const result = await service.isMessageValid({ RequestType: "Trader", msgType: "NewOrderSingle", Currency: "EUR" });
            expect(result).toBeDefined();
            expect(result).toEqual(false);
        });
    });

    describe("treatMessage()", () => {
        it("should format message", async () => {
            const token = "AAAAA";
            service.setFilter(filter);
            const result = await service.treatMessage({ RequestType: "Trader", msgType: "NewOrderSingle"
            , Currency: "EUR", RaID: "aaa", Limit: 1000, Blem: "aaaa"});
            console.log("result,", result);
            expect(result["Blem"]).not.toBeDefined();
            expect(result["Limit"]).toEqual(1000);
        });
    });
});
