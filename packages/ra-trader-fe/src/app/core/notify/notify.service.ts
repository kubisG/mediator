import { Injectable } from "@angular/core";
import { ToasterService, Toast } from "angular2-toaster";
import { Howl } from "howler";
import { SoundService } from "../sound.service";
import { NotifyListService } from "@ra/web-components";

@Injectable()
export class NotifyService {

    constructor(
        private toasterService: ToasterService,
        private soundService: SoundService,
        private notifyListService: NotifyListService,
    ) { }

    private getSoundType(popType: string) {
        return this.soundService.getSound(popType);
    }

    pop(type: string | Toast, title?: string, body?: string, sound: boolean = false, popSound: string = "default",
        shown: boolean = true): Toast {

        if (typeof type === "string") {
            this.notifyListService.pop(type, title, body);
        }
        if (shown) {
            if (sound) {
                let popType;
                if (popSound === "default") {
                    if (!(type as Toast).type) {
                        popType = type;
                    } else {
                        popType = (type as Toast).type;
                    }
                } else {
                    popType = popSound;
                }
                this.playSound(popType);
            }
            return this.toasterService.pop(type, title, body);
        } else {
            return null;
        }
    }

    clear() {
        this.toasterService.clear();
    }

    public playSound(popType: string) {
        const soundType = this.getSoundType(popType);
        if (soundType) {
            const playSound = new Howl({
                src: [soundType.file]
            });
            playSound.play();
        }
    }
}
