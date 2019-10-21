import { Request } from "./request.interface";
import { RequestType } from "./request-type.enum";

export class SubscribeRequestDto implements Request {
    id: number;
    type: RequestType = RequestType.locates;
    clientId?: string;
}
