import { ResponseType } from "./response-type.enum";

export interface Response {
    id: string; // client.id + fastRandom
    type: ResponseType;
    clientId?: string;
    data?: any[];
}
