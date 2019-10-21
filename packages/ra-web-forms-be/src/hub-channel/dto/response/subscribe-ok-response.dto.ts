import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class SubscribeOkResponse implements Response {
    id: string;
    type: ResponseType = ResponseType.subscribeOk;
    clientId: string;
}
