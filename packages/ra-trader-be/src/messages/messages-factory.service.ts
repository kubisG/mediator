import { Injectable, Inject } from "@nestjs/common";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Message } from "./model/message";

@Injectable()
export class MessagesFactoryService {

    constructor(
        @Inject("messageFilter") private messageFilter: MessageValidatorService,
    ) { }

    public create<T extends Message>(
        target: new (data: any, messageFilter: MessageValidatorService) => T,
        data: object | string,
    ): T {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        return new target(data, this.messageFilter) as T;
    }

}
