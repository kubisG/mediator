import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class SubscribeErrResponseDto implements Response {
    id: string;
    clientId: string;
    channelId: string;
    type: ResponseType = ResponseType.subscribeErr;
    error: string;
}
