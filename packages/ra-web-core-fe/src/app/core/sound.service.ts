import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: "root",
})
export class SoundService {

    private soundsInitialized = false;

    private sounds: { [key: string]: any } = {
        "disconnect": {
            "name": "disconnect",
            "file": "/assets/sound/disconnect.wav"
        },
        "error": {
            "name": "error",
            "file": "/assets/sound/error.wav"
        },
        "info": {
            "name": "info",
            "file": ""
        },
        "success": {
            "name": "success",
            "file": ""
        },
        "warning": {
            "name": "warning",
            "file": "/assets/sound/warning.wav"
        },
        "message_ioi": {
            "name": "message_ioi",
            "file": "/assets/sound/ioi.wav"
        },
        "message_order": {
            "name": "message_order",
            "file": "/assets/sound/order.wav"
        },
        "message_fill": {
            "name": "message_fill",
            "file": "/assets/sound/fill.wav"
        },
        "message_allocation": {
            "name": "message_allocation",
            "file": ""
        }
    };

    private soundsListSubject: BehaviorSubject<{ name: string, file: string }[]>
        = new BehaviorSubject<{ name: string, file: string }[]>([]);
    public soundsList$: Observable<{ name: string, file: string }[]> = this.soundsListSubject.asObservable();

    private appSounds: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});
    public appSounds$: Observable<{ [key: string]: any }> = this.appSounds.asObservable();

    constructor(
        private http: HttpClient,
    ) {
        this.loadSounds();
    }

    public loadSounds(): void {
        if (this.soundsInitialized) {
            return;
        }
        this.http.get<any>(`/assets/sound/sound.json`).toPromise().then((data) => {
            this.sounds = data.app;
            this.appSounds.next(data.app);
            this.soundsListSubject.next(data.list);
            this.soundsInitialized = true;
        });
    }

    public getSound(key: string): any {
        if (this.sounds[key]) {
            return this.sounds[key];
        }
        return null;
    }

}
