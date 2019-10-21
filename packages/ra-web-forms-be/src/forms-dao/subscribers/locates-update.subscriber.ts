import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import createSubscriber from "pg-listen";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Subject, Observable } from "rxjs";

@Injectable()
export class LocatesUpdateSubscriber implements OnApplicationShutdown {

    private updateSubject: Subject<any> = new Subject<any>();
    public updateSubject$: Observable<any> = this.updateSubject.asObservable();

    private subscriber;

    constructor(private env: EnvironmentService) {
        this.subscriber = createSubscriber({
            connectionString: "postgres://" + env.db.user + ":" + env.db.password + "@"
                + env.db.host + ":" + env.db.port + "/" + env.db.db,
        });
        this.init();
    }

    private async init() {
        await this.subscriber.connect();
        await this.subscriber.listenTo("locatesUpdateEvt");
        this.subscriber.notifications.on("locatesUpdateEvt", (payload) => {
            this.updateSubject.next(payload);
        });

        this.subscriber.events.on("error", (error) => {
            console.error("Fatal database connection error:", error);
            this.subscriber.close();
        });

    }

    onApplicationShutdown() {
        if (this.subscriber) {
            this.subscriber.close();
        }
    }
}
