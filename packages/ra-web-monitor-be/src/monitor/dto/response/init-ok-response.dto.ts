import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";
import { StoresDto } from "./stores.dto";

export class InitOkResponse implements Response {
    id: string;
    type: ResponseType = ResponseType.initOk;
    clientId: string;
    stores: StoresDto[];
}
