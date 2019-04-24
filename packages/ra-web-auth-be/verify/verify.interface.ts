import { AuthDto } from "../dto/auth.dto";
import { RaUser } from "../../core/db/entity/ra-user";

export interface Verify {
    find(credentials: AuthDto): Promise<RaUser>;
}
