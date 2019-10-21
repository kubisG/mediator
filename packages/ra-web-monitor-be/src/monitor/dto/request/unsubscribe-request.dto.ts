import { Request } from "./request.interface";
import { RequestType } from "./request-type.enum";

export class UnSubscribeRequestDto implements Request {
    id: number;
    clientId: string;
    channelId: string;
    type: RequestType = RequestType.unSubscribe;
}
