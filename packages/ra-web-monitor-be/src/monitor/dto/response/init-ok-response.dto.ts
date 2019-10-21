import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class InitOkResponse implements Response {
    id: string;
    type: ResponseType = ResponseType.initOk;
    clientId: string;
    stores: { prefix: string, name: string }[];
}
