import { Injectable, UnauthorizedException, Inject, HttpException } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthDto } from "@ra/web-auth-be/dist/dto/auth.dto";
import { UserData } from "./user-data.interface";
import { PreferenceRepository } from "@ra/web-core-be/dist/dao/repositories/preference.repository";
import * as generator from "generate-password";
import { bcryptHash } from "@ra/web-core-be/dist/utils";
import { UserRepository } from "@ra/web-core-be/dist/dao/repositories/user.repository";
import { HttpStatus } from "@nestjs/common";
import { RaUser } from "@ra/web-core-be/dist/db/entity/ra-user";
import { LightMapper } from "light-mapper";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class UsersService {

    public switchLogging: Subject<any> = new Subject<any>();
    public switchLogging$: Observable<any> = this.switchLogging.asObservable();

    constructor(
        private authService: AuthService,
        @Inject("preferenceRepository") private preferenceRepository: PreferenceRepository,
        @Inject("userRepository") private raUser: UserRepository,
        @Inject("mailer") private emailsService,
        private env: EnvironmentService,
    ) { }

    getVersion() {
        return this.env.appVersion ? this.env.appVersion : "1.0.0";
    }

    async logIn(auth: AuthDto): Promise<any> {
        const bearerToken = await this.authService.createToken(auth);
        if (bearerToken === null) {
            throw new UnauthorizedException();
        }
        return bearerToken;
    }

    public async setLogging(userId: number, companyId: number, enabled: any) {
        enabled = (enabled === "true" ? true : false);
        const settings = { userId, companyId, enabled };
        this.switchLogging.next(settings);
        const pref = await this.preferenceRepository.findOne({
            userId,
            companyId,
            name: "layout.prefs",
        });
        let json = {};
        if (pref) {
            json = JSON.parse(pref.value);
        }
        if (json["logging"]) {
            json["logging"] = enabled;
        } else {
            json["logging"] = enabled;
        }
        if (pref) {
            pref.value = JSON.stringify(json);
            return await this.preferenceRepository.save(pref);
        } else {
            return await this.preferenceRepository.save({
                userId,
                companyId,
                name: "layout.prefs",
                value: JSON.stringify(json),
            });
        }
    }

    /**
     * TODO : text to config/db
     * @param email
     */
    async resetMail(email: string): Promise<any> {
        const user = await this.raUser.findOne({ email });
        const status = { message: "", statusCode: HttpStatus.OK };

        if (user) {
            const newpassword = generator.generate({
                length: 10,
                numbers: true,
            });

            user.password = await bcryptHash(newpassword);
            await this.raUser.save(user);
            this.emailsService.send("info@rapidaddition.com", user.email, "RappidAdditon Order Manager - Password reset", newpassword);
            status.message = "New password created and sended";
        } else {
            throw new HttpException("Email doesnt exists", HttpStatus.NOT_FOUND);
        }
        return status;
    }

    async logOut(token: string): Promise<any> {
        return await this.authService.destroySession(token);
    }

    async getUsersLayoutPreferences() {
        const prefs = await this.preferenceRepository.createQueryBuilder("pref")
        .where("pref.userId > 0 AND pref.companyId > 0 AND pref.name = 'layout.prefs'")
        .getMany();
        const buff = {};
        for (const pref of prefs) {
            const json = JSON.parse(pref.value);
            buff[`${pref.userId}-${pref.companyId}`] = json;
        }
        return buff;
    }

    async findAll(token: string): Promise<[RaUser[], number]> {
        return await this.raUser.findAndCount({ relations: ["company"], order: { username: "ASC" } });
    }

    async findCompAll(token: string): Promise<RaUser[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raUser.find({ where: { compId: userData.compId }, relations: ["company"], order: { username: "ASC" } });
    }

    async findOne(id: any): Promise<RaUser> {
        return await this.raUser.findOne({ id }, { relations: ["company"] });
    }

    async delete(id: any): Promise<any> {
        return await this.raUser.delete({ id });
    }

    /**
     * Creates user
     * @param user  user informations
     */
    async createUser(token: any, user: any): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (user.company) {
            user.company = user.company.id;
        }
        try {
            const mapper = new LightMapper();
            const raUser = mapper.map<RaUser>(RaUser, user);
            raUser.password = await bcryptHash(user.password);
            const newUser = await this.raUser.save(raUser);
            const savedUser = await this.findOne(newUser.id);
            delete savedUser.password;
            return savedUser;
        } catch (ex) {
            throw new DbException(ex, "RaUser");
        }
    }

    async updateUser(id, user: any, token: any): Promise<any> {
        let userData;
        if (token !== null) {
            userData = await this.authService.getUserData<UserData>(token);
            if ((userData.role !== "ADMIN") && (id !== userData.id)) {
                return;
            }
        } else {
            return;
        }
        try {
            const mapper = new LightMapper();
            if (!user.company) {
                user.company = userData.compId;
            }

            const raUser = mapper.map<RaUser>(RaUser, user);

            if (user.password) {
                raUser.password = await bcryptHash(user.password);
            } else {
                delete raUser.password;
            }
            if (userData.role !== "ADMIN") {
                delete raUser.email;
                delete raUser.username;
                delete raUser.company;
                delete raUser.class;
            }

            await this.raUser.update({ id }, raUser);
            const savedUser = await this.findOne(id);
            delete savedUser.password;
            return savedUser;
        } catch (ex) {
            console.log("err", ex);
            throw new DbException(ex, "RaUser");
        }
    }

    async getLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.getLayoutConfig(userData.userId, userData.compId, name, this.getVersion());
    }

    async setLayoutConfig(token: string, config: any, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.setLayoutConfig(userData.userId, userData.compId, config, name, this.getVersion());
    }

    async deleteLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.deleteLayoutConfig(userData.userId, userData.compId, name, this.getVersion());
    }

    async getLayoutsName(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.getLayoutsName(userData.userId, userData.compId, this.getVersion());
    }

}
