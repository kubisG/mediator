export class WsSubscribeErrDto {
    public event: string = "subscribeErr";
    constructor(public data: any) { }
}
