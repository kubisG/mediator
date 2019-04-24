import { Verify } from "./verify.interface";
import { AuthDto } from "../dto/auth.dto";

export class DummyVerify implements Verify {

    async find(credentials: AuthDto): Promise<any> {
        if (credentials.email === "hajekj14@gmail.com" && credentials.password === "123456789") {
            return { email: "hajekj14@gmail.com" };
        } else if (credentials.email === "test2@test.cz" && credentials.password === "123456789") {
            return { email: "test2@test.cz" };
        }
        return null;
    }

}
