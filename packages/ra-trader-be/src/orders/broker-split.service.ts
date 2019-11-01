import { Injectable, Inject } from "@nestjs/common";

import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { Connection } from "typeorm/connection/Connection";
import { Repository } from "typeorm/repository/Repository";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ExecutionReport } from "../broker/messages/execution-report";
import { LightMapper } from "light-mapper";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";
import { RaOrderStore } from "../entity/ra-order-store";
import { RaMessage } from "../entity/ra-message";

@Injectable()
export class BrokerSplitService {

    protected consumeParentSubject: Subject<any> = new Subject<any>();
    protected consumeParentSubject$: Observable<any> = this.consumeParentSubject.asObservable();

    constructor(
        @Inject("DbConnection") public dbConnection: () => Connection,
        @Inject("fastRandom") private fastRandom: any,
    ) { }

    public async updateParentMsg(data: any) {
        this.consumeParentSubject.next(data);
    }

    public getParentSubject(): Subject<any> {
        return this.consumeParentSubject;
    }

    private getFillExecType(orderQty: number, filledQty: number) {
        if (filledQty < orderQty) {
            return ExecType.PartialFill;
        }
        return ExecType.Fill;
    }

    private getFillOrderStatus(orderQty: number, filledQty: number) {
        if (filledQty < orderQty) {
            return OrdStatus.PartiallyFilled;
        }
        return OrdStatus.Filled;
    }

    private async calculateValue(parentMessage: RaOrderStore, childMessage) {
        delete parentMessage.ClOrdLinkID;

        parentMessage.LastPx = Number(childMessage.LastPx);
        parentMessage.LastQty = Number(childMessage.LastQty);

        parentMessage.CumQty = Number(parentMessage.CumQty ? parentMessage.CumQty : 0) + Number(childMessage.LastQty);
        parentMessage.LeavesQty = parentMessage.OrderQty - parentMessage.CumQty;

        parentMessage["ExecType"] = this.getFillExecType(
            Number(parentMessage.OrderQty),
            parentMessage.CumQty,
        );
        parentMessage.OrdStatus = this.getFillOrderStatus(
            Number(parentMessage.OrderQty),
            parentMessage.CumQty,
        );
    }

    private async calculateAvgPx(parentMessage: RaOrderStore, childMessage) {
        return ((Number(childMessage.LastPx) * Number(childMessage.LastQty)) +
            (Number(parentMessage.CumQty ? parentMessage.CumQty : 0) * Number(parentMessage.AvgPx ? parentMessage.AvgPx : 0)))
            / (Number(parentMessage.CumQty ? parentMessage.CumQty : 0) + Number(childMessage.LastQty));
    }

    public async processParentMessage(data): Promise<any> {
        // moved to transaction for propper data update
        return await this.dbConnection().transaction(async (transactionalEntityManager) => {
            const raOrderStoreToken: Repository<RaOrderStore> = transactionalEntityManager.getRepository(RaOrderStore);
            const raMessageToken: Repository<RaMessage> = transactionalEntityManager.getRepository(RaMessage);

            await raOrderStoreToken.update({
                ClOrdID: data.data.ClOrdLinkID,
                company: data.company,
                app: Number(Apps.broker),
            },
                {
                    updateDate: new Date(),
                });

            const result = await raOrderStoreToken.findOne({
                ClOrdID: data.data.ClOrdLinkID,
                company: data.company,
                app: Number(Apps.broker),
            });

            if (result.JsonMessage) {
                const jsonMessage = JSON.parse(result.JsonMessage);
                for (const messid in jsonMessage) {
                    if ((messid) && (!result[messid])) {
                        result[messid] = jsonMessage[messid];
                    }
                }
                delete result.JsonMessage;
            }

            // if (data.data.ExecType === ExecType.TradeCancel) {
            //     console.log("DATA");
            //     console.log(data);
            //     console.log("ORIGINAL");
            //     console.log(data.data.original);
            //     await this.setCancelTrade(result, data, raMessageToken);
            //     console.log("RESULT");
            //     console.log(result);
            // }else {
            let avgPx = await this.calculateAvgPx(result, data.data);
            if (isNaN(avgPx)) {
                avgPx = 0;
            }
            await this.calculateValue(result, data.data);
            // }

            // we need to update values immediatelly
            await raOrderStoreToken.update({ id: result.id },
                {
                    CumQty: result.CumQty, LeavesQty: result.LeavesQty,
                    AvgPx: avgPx,
                });

            const mapper = new LightMapper();
            const raId = result.RaID;
            const report = mapper
                .map<ExecutionReport>(ExecutionReport, result);
            report.ExecID = `EX${this.fastRandom.nextInt()}`;
            report.RaID = raId;
            report.ExecTransType = data.ExecTransType ? data.ExecTransType : ExecTransType.New;
            report.TransactTime = new Date().toISOString();
            report.RequestType = "Broker";
            return report;
        });
    }

    private async setCancelTrade(parentMessage: RaOrderStore, data: any, raMessageToken: any) {
        const resultMessage = await raMessageToken.findOne({
            ClOrdID: data.data.ClOrdLinkID,
            company: data.company,
            app: Apps.broker,
            OrdStatus: data.data.original.OrdStatus,
            CumQty: data.data.original.CumQty,
            LeavesQty: data.data.original.LeavesQty,
            LastPx: data.data.original.LastPx,
            LastQty: data.data.original.LastQty,
        });
        parentMessage["original"] = { ...resultMessage };
        const avgPx = (parentMessage.CumQty * parentMessage.AvgPx);

        parentMessage.CumQty = parentMessage.CumQty - resultMessage.LastQty;
        parentMessage.LeavesQty = parentMessage.OrderQty - parentMessage.CumQty;
        if (parentMessage.CumQty > 0) {
            parentMessage.AvgPx = (avgPx - (resultMessage.LastQty * resultMessage.LastPx)) / parentMessage.CumQty;
        } else {
            parentMessage.AvgPx = 0;
        }
        parentMessage.OrdStatus = parentMessage.CumQty === 0 ? OrdStatus.New : OrdStatus.PartiallyFilled;
    }

}
