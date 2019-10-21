import { Request } from "./request.interface";
import { RequestType } from "./request-type.enum";

export class StoresListDto implements Request {
    id: number;
    clientId: string;
    type: RequestType = RequestType.stores;
}
