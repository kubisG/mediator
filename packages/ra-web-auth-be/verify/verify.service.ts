import { Injectable } from "@nestjs/common";
import { Verify } from "./verify.interface";
import { AuthDto } from "../dto/auth.dto";

@Injectable()
export class VerifyService implements Verify {

    async find(credentials: AuthDto): Promise<any> {
        return { email: credentials.email, bla: 222 };
    }

}
