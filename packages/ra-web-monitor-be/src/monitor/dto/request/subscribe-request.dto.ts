import { Request } from "./request.interface";
import { RequestType } from "./request-type.enum";

export class SubscribeRequestDto implements Request {
    id: number;
    clientId: string;
    channelId: string;
    type: RequestType = RequestType.subscribe;
    query: string;
    page: number;
}
