import { RequestType } from "./request-type.enum";

export interface Request {
    id: number; // client.id + fastRandom
    clientId?: string;
    channelId?: string;
    type: RequestType;
}
