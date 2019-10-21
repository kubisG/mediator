import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class SubscribeOkResponse implements Response {
    id: string;
    clientId: string;
    channelId: string;
    type: ResponseType = ResponseType.subscribeOk;
    columns: any[];
    snapshot: any[];
    pageCount: number;
}
