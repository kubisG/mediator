import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Message } from "../../messages/model/message";
import { MessagesFactoryService } from "../../messages/messages-factory.service";
import { Injectable } from "@nestjs/common";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { SpecType } from "@ra/web-core-be/dist/enums/spec-type.enum";

@Injectable()
export class FilterMiddleware implements MessageMiddleware {

    constructor(
        private messagesFactoryService: MessagesFactoryService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        const message: Message = this.messagesFactoryService.create<Message>(Message, data);
        if ((!context.queue) && (message.getSpecType() !== SpecType.phone)) {
            return await message.getJSONAsync(true);
        }
        return { ...message.getJSON(), notSave: true };
    }

}
