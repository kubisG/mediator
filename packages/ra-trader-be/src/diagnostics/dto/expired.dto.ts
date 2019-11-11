import { WsResponse } from "@nestjs/websockets";

export class ExpiredDto implements WsResponse {
    public event: string = "expired";

    constructor(public data: any) {

    }
}
