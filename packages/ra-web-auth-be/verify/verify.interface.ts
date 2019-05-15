import { AuthDto } from "../dto/auth.dto";

export interface Verify {
    find(credentials: AuthDto): Promise<any>;
}
