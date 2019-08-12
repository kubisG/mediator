import { Verify } from "@ra/web-auth-be/verify/verify.interface";
import { AuthDto } from "@ra/web-auth-be/dto/auth.dto";
import { bcryptCompare } from "@ra/web-core-be/utils";
import { Injectable, Inject } from "@nestjs/common";
import { UserRepository } from "@ra/web-core-be/dao/repositories/user.repository";

@Injectable()
export class UserAuthVerify implements Verify {

    constructor(
        @Inject("userRepository") private userRepository: UserRepository,
    ) { }

    async find(credentials: AuthDto): Promise<any> {
        const user = await this.userRepository.findOne({ email: credentials.email }, { relations: ["company"] });
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
