import { Injectable, Inject } from "@nestjs/common";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { ExceptionDto } from "./dto/exception.dto";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";
import { InfoDto } from "./dto/info.dto";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";

@Injectable()
export class SystemChannelService {

    protected consumeInfoSubject: Subject<any> = new Subject<any>();
    protected consumeInfoSubject$: Observable<any> = this.consumeInfoSubject.asObservable();

    protected exceptionSubject: Subject<any> = new Subject<any>();
    protected exceptionSubject$: Observable<any> = this.exceptionSubject.asObservable();

    private subscriptions: any[] = [];

    constructor(
        public authService: AuthService,
        @Inject("logger") public logger: Logger,
    ) {
    }

    public async exception(token: string, client: any): Promise<Observable<ExceptionDto>> {
        const userData = await this.authService.getUserData(token) as UserData;

        return new Observable((observer) => {
            const subscription = this.exceptionSubject$.subscribe((data) => {
                if (data && data.userId && data.userId === userData.userId) {
                    observer.next(new ExceptionDto(data.message ? data.message : data));
                }
            });
            if (this.subscriptions[client.client.id]) {
                this.subscriptions[client.client.id].add(subscription);
            } else {
                this.subscriptions[client.client.id] = subscription;
            }
        });
    }

    public async info(token: string, client: any): Promise<Observable<InfoDto>> {
        const userData = await this.authService.getUserData(token) as UserData;
        return new Observable((observer) => {
            const subscription = this.consumeInfoSubject$.subscribe((data) => {
                if (data && data.userId && data.userId === userData.userId) {
                    observer.next(new InfoDto(data));
                }
            });
            if (this.subscriptions[client.client.id]) {
                this.subscriptions[client.client.id].add(subscription);
            } else {
                this.subscriptions[client.client.id] = subscription;
            }
        });
    }

    public sendException(data) {
        this.exceptionSubject.next(data);
    }

    public sendInfo(data) {
        this.consumeInfoSubject.next(data);
    }

    public removeClient(client) {
        if (this.subscriptions[client.client.id]) {
            this.subscriptions[client.client.id].unsubscribe();
        }
    }

    public getSubscriptions() {
        return this.subscriptions;
    }
}
