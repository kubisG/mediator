import { WsResponse } from "@nestjs/websockets";

export class StatusDto implements WsResponse {
    public event: string = "status";

    constructor(public data: any) {

    }
}
