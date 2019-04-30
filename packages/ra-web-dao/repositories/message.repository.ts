import { RaMessage } from "@ra/web-core-be/db/entity/ra-message";
import { EntityRepository,  Repository} from "typeorm";
import { MessageType } from "@ra/web-core-be/enums/message-type.enum";

@EntityRepository(RaMessage)
export class MessageRepository extends  Repository<RaMessage> {

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
                + "rm.\"msgType\" not in (:...BmsgType))"
                , {
                    raId: raId, OrigClOrdID: OrigClOrdID, app: app,
                    BmsgType: [MessageType.Replace, MessageType.Order, MessageType.Cancel]
                })
            .getMany();

        return result;
    }

}
