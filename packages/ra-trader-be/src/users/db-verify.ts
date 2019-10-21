import { bcryptCompare } from "@ra/web-core-be/dist/utils";
import { Verify } from "@ra/web-auth-be/dist/verify/verify.interface";
import { RaUser } from "../entity/ra-user";
import { AuthDto } from "@ra/web-auth-be/dist/dto/auth.dto";
import { UserRepository } from "../dao/repositories/user.repository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DbVerify implements Verify {

    constructor(
        @Inject("userRepository") private raUser: UserRepository,
        ) { }

    async find(credentials: AuthDto): Promise<RaUser> {
        const user = await this.raUser.findOne({ email: credentials.email }, { relations: ["company"] });
        if (!user) {
            return null;
        }
        const verifyPassResult = await bcryptCompare(credentials.password, user.password);
        if (verifyPassResult) {
            delete user.password;
            return user;
        }
        return null;
    }

}
