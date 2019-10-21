import { Request } from "./request.interface";
import { RequestType } from "./request-type.enum";

export class UnSubscribeAllRequestDto implements Request {
    id: number;
    type: RequestType = RequestType.unSubscribeAll;
}
