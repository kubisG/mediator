import { WsResponse } from "@nestjs/websockets";

export class InfoDto implements WsResponse {
    public event: string = "info";

    constructor(public data: any) {

    }
}
