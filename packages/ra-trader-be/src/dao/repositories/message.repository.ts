import { EntityRepository, Repository } from "typeorm";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { RaMessage } from "../../entity/ra-message";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";

@EntityRepository(RaMessage)
export class MessageRepository extends Repository<RaMessage> {

    public async getPendingMessages(raId: string, OrigClOrdID: string, app: number) {
        const result = await this.createQueryBuilder("ord")
            .where("ord.\"RaID\"=:raId and ord.\"app\"=:app and ord.\"ClOrdID\"=:OrigClOrdID"
                , { raId: raId, OrigClOrdID: OrigClOrdID, app: app })
            .andWhere("ord.\"msgType\" in (:...AmsgType)", {
                AmsgType:
                    [MessageType.Replace, MessageType.Order, MessageType.Cancel]
            })
            .andWhere("not exists (select id from ra_message rm" +
                " where rm.\"RaID\"=:raId and rm.\"app\"=:app and rm.\"ClOrdID\"=:OrigClOrdID and "
                + "((rm.\"msgType\" not in (:...BmsgType)) and (rm.\"msgType\" not in (:...CmsgType)"
                + " OR rm.\"OrdStatus\" not in (:...PendingNew))))"
                , {
                    raId: raId, OrigClOrdID: OrigClOrdID, app: app,
                    BmsgType: [MessageType.Replace, MessageType.Order, MessageType.Cancel],
                    CmsgType: [MessageType.Execution],
                    PendingNew: [OrdStatus.PendingNew]
                })
            .getMany();

        return result;
    }

    public async getFillMessage(app: number, compId: number) {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        const result = await this.createQueryBuilder("ord")
            .where("ord.\"app\"=:app and ord.\"companyId\"=:company and ord.\"TransactTime\">=:time"
                , { app: app, company: compId, time: today })
            .andWhere("ord.\"ExecType\" in (:...AexecType)", {
                AexecType:
                    [ExecType.PartialFill, ExecType.Fill, ExecType.Trade]
            })
            .andWhere("not exists (select id from ra_order_store ros" +
                " where ros.\"RaID\"=ord.\"RaID\" and ros.\"app\"=:app and ros.\"companyId\"=:company and ros.\"specType\"='phone')"
                , {
                    app: app, company: compId
                })
            .getMany();

        console.log("result", result);
        return result;
    }
}
