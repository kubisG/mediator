import { Injectable, Inject } from "@nestjs/common";
import { Verify } from "./verify/verify.interface";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class VerifyProviderService {

    constructor(
        @Inject("verifyService") public verifyService: Verify,
    ) { }

    public setVerifyService(verifyService: Verify) {
        this.verifyService = verifyService;
    }

    public async find(credentials: AuthDto): Promise<any> {
        return this.verifyService.find(credentials);
    }

}
