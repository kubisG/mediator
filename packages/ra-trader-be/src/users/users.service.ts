import { Injectable, UnauthorizedException, Inject, HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { LightMapper } from "light-mapper";

import { AuthDto } from "@ra/web-auth-be/dist/dto/auth.dto";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { UserDto } from "./dto/user.dto";
import { bcryptHash } from "@ra/web-core-be/dist/utils";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import * as generator from "generate-password";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { HttpCacheService } from "@ra/web-core-be/dist/http-cache.service";
import { UserRepository } from "../dao/repositories/user.repository";
import { PreferenceRepository } from "../dao/repositories/preference.repository";
import { RaUser } from "../entity/ra-user";
import { UserData } from "./user-data.interface";
import { environment } from "@ra/web-env-be/dist/environment";

@Injectable()
export class UsersService {

    public switchLogging: Subject<any> = new Subject<any>();
    public switchLogging$: Observable<any> = this.switchLogging.asObservable();

    constructor(
        private readonly authService: AuthService,
        private readonly httpCacheService: HttpCacheService,
        @Inject("userRepository") private raUser: UserRepository,
        @Inject("preferenceRepository") private raPreferences: PreferenceRepository,
        @Inject("mailer") private emailsService,
    ) { }

    public async setLogging(userId: number, companyId: number, enabled: any) {
        enabled = (enabled === "true" ? true : false);
        const settings = { userId, companyId, enabled };
        this.switchLogging.next(settings);
        const pref = await this.raPreferences.findOne({
            userId,
            companyId,
            name: "layout.prefs"
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
            return await this.raPreferences.save(pref);
        } else {
            return await this.raPreferences.save({
                userId,
                companyId,
                name: "layout.prefs",
                value: JSON.stringify(json)
            });
        }
    }


    public init(token: string) {
        return new Observable((observer) => {
            this.switchLogging$.subscribe((settings) => {
                this.authService.getUserData(token).then((userData: UserData) => {
                    if (userData.userId && settings.userId === `${userData.userId}` && settings.companyId === `${userData.compId}`) {
                        observer.next({
                            event: "switchLogging",
                            data: settings,
                        });
                    }
                });
            });
            this.httpCacheService.getClearCache().subscribe((company: string) => {
                this.authService.getUserData(token).then((userData: UserData) => {
                    if (!company || (Number(company) === Number(userData.compId))) {
                        observer.next({
                            event: "clearCache",
                            data: true,
                        });
                    }
                });
            });
        });
    }

    async logIn(auth: AuthDto): Promise<any> {
        const bearerToken = await this.authService.createToken(auth);
        if (bearerToken === null) {
            throw new UnauthorizedException();
        }
        return bearerToken;
    }

    /**
     * TODO : text to config/db
     * @param email
     */
    async resetMail(email: string): Promise<any> {
        const user = await this.raUser.findOne({ email: email });
        const status = { message: "", statusCode: HttpStatus.OK };

        if (user) {
            const newpassword = generator.generate({
                length: 10,
                numbers: true
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

    /**
     * TODO : text to config/db
     * @param id, user
     */
    async welcomeMail(email: any, token: any): Promise<any> {
        const user = await this.raUser.findOne({ email: email });
        const status = { message: "", statusCode: HttpStatus.OK };

        if (user) {
            const text = "Hello " + user.firstName + " " + user.lastName + "," + "\n"
                + "An RA Order Manager account has now been set up for you." + "\n"
                + "Username: " + user.email + "\n"
                + " " + "\n"
                + "Please use the link provided below and use 'Reset password' link, to reset your password." + "\n"
                + environment.appUrl.url() + "\n"
                + " " + "\n"
                + "If you have any further question then please ask your administrator." + "\n"
                + "Many Thanks," + "\n"
                + "Administrator (RA Order Manager)" + "\n"
                ;
            this.emailsService.send("info@rapidaddition.com", user.email, "RappidAdditon Order Manager - Welcome", text);
            status.message = "Welcome mail sended";
        } else {
            throw new HttpException("Email doesnt exists", HttpStatus.NOT_FOUND);
        }
        return status;
    }

    async logOut(token: string): Promise<any> {
        return await this.authService.destroySession(token);
    }

    async findAll(token: string, page: number = 0, sort: string = "ASC"): Promise<[RaUser[], number]> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (userData.app === 0) {
            return await this.raUser.findAndCount({ relations: ["company"], order: { username: "ASC" } });
        }
        return await this.raUser.findAndCount({ where: { app: userData.app }, relations: ["company"], order: { username: "ASC" } });
    }

    async findCompAll(token: string): Promise<RaUser[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raUser.find({ where: { compId: userData.compId }, relations: ["company"], order: { username: "ASC" } });
    }

    async getUsersLayoutPreferences() {
        const prefs = await this.raPreferences.getUsersLayoutPrefs();
        const buff = {};
        for (let i = 0; i < prefs.length; i++) {
            const json = JSON.parse(prefs[i].value);
            buff[`${prefs[i].userId}-${prefs[i].companyId}`] = json;
        }
        return buff;
    }

    async findOne(id: any): Promise<RaUser> {
        return await this.raUser.findOne({ id: id }, { relations: ["company"] });
    }

    async delete(id: any): Promise<any> {
        return await this.raUser.delete({ id: id });
    }

    /**
     * Creates user
     * @param user  user informations
     */
    async createUser(token: any, user: UserDto): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (userData.app !== 0 && userData.app !== user.app) {
            user.app = userData.app;
        }
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
        if (userData.app !== 0 && userData.app !== user.app) {
            user.app = userData.app;
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
                delete raUser.currentBalance;
                delete raUser.openBalance;
                delete raUser.username;
                delete raUser.company;
                delete raUser.class;
            }

            await this.raUser.update({ id: id }, raUser);
            const savedUser = await this.findOne(id);
            delete savedUser.password;
            return savedUser;
        } catch (ex) {
            throw new DbException(ex, "RaUser");
        }
    }

    async getLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutConfig(userData.userId, userData.compId, name);
    }

    async setLayoutConfig(token: string, config: any, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.setLayoutConfig(userData.userId, userData.compId, config, name);
    }

    async getLayoutDefault(token: string, modul: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.findOne({
            userId: userData.userId,
            companyId: userData.compId,
            name: `default_layout_${modul}`
        });

    }

    async setLayoutDefault(token: string, modul: string, name: any) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.save({
            name: `default_layout_${modul}`,
            value: name,
            userId: userData.userId,
            companyId: userData.compId,
        });
    }


    async deleteLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.deleteLayoutConfig(userData.userId, userData.compId, name);
    }

    async getLayoutsName(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutsName(userData.userId, userData.compId);
    }
}
