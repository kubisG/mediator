import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class DataResponseDto implements Response {
    id: string;
    type: ResponseType = ResponseType.data;
    hosts: { channelId: string, clientId: string }[];
    data: any[];
}
