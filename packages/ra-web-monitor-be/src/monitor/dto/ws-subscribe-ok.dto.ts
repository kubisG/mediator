export class WsSubscribeOkDto {
    public event: string = "subscribeOk";
    constructor(public data: any) { }
}
