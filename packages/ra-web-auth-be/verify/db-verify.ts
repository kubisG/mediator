import { Verify } from "./verify.interface";
import { AuthDto } from "../dto/auth.dto";
import { RaUser } from "../../core/db/entity/ra-user";
import { Repository } from "typeorm";
import { bcryptCompare } from "../../core/utils";

export class DbVerify implements Verify {

    constructor(private raUser: Repository<RaUser>) { }

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
