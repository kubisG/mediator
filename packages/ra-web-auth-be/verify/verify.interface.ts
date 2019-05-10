import { AuthDto } from "../dto/auth.dto";
import { RaUser } from "@ra/web-core-be/db/entity/ra-user";

export interface Verify {
    find(credentials: AuthDto): Promise<any>;
}
