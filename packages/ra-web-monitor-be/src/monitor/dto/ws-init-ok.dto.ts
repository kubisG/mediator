export class WsInitOkDto {
    public event: string = "initOk";
    constructor(public data: any) { }
}
