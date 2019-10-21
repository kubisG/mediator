import { RequestType } from "./request-type.enum";

export interface Request {
    id: number; // fastRandom
    type: RequestType;
    clientId?: string;
    data?: any;
}
