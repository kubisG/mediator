import { ResponseType } from "./response-type.enum";

export interface Response {
    id: string; // client.id + fastRandom
    type: ResponseType;
    hosts?: { channelId: string, clientId: string }[];
    clientId?: string;
    channelId?: string;
}
