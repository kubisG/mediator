import { Response } from "./response.interface";
import { ResponseType } from "./response-type.enum";

export class PageResponse implements Response {
    id: string;
    type: ResponseType = ResponseType.page;
    hosts: { channelId: string, clientId: string }[];
    newPage: number;
    newPageCount: number;
}
