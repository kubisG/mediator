import { Inject, Injectable } from "@nestjs/common";
import { SessionData } from "./session-data/session-data.interface";

@Injectable()
export class SessionDataProviderService {

    public sessionDataService: SessionData;

    constructor() { }

    public setSessionDataService(sessionDataService: SessionData) {
        this.sessionDataService = sessionDataService;
    }

}
