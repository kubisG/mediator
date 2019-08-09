import { Component, OnInit, Injector, ComponentFactoryResolver, ApplicationRef } from "@angular/core";
import { Howl } from "howler";
import { SoundService } from "../../core/sound.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { NotifyService } from "../../core/notify/notify.service";
import { LayoutRights, Dockable, DockableComponent } from "@ra/web-components";

@LayoutRights({})
@Dockable({
    label: "Sounds",
    icon: "surround_sound",
})
@Component({
    selector: "ra-sounds",
    templateUrl: "./sounds.component.html",
    styleUrls: ["./sounds.component.less"]
})
export class SoundsComponent extends DockableComponent implements OnInit {

    public empty: { name: string, file: string } = { name: "none", file: null };
    public collapsed: boolean;
    public soundsList: { name: string, file: string }[] = [];
    public appSounds: { [key: string]: any } = {
        disconnect: {},
        error: {},
        info: {},
        success: {},
        warning: {},
        message_ioi: {},
        message_order: {},
        message_fill: {},
        message_allocation: {},
    };

    constructor(
        private soundService: SoundService,
        private restPreferencesService: RestPreferencesService,
        private toasterService: NotifyService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    ngOnInit(): void {
        this.soundService.soundsList$.subscribe((data) => {
            this.soundsList = data;
        });
        this.restPreferencesService.getUserPref("sounds").then((data) => {
            if (data === null) {
                this.soundService.appSounds$.subscribe((assetsData) => {
                    this.appSounds = assetsData;
                });
                return;
            }
            this.appSounds = data;
        });
    }

    selectComparator(o1: any, o2: any) {
        return o1 && o2 && o1.file && o2.file && o1.file === o2.file;
    }

    playSound(sound) {
        if (sound && sound.file) {
            const playSound = new Howl({
                src: [sound.file]
            });
            playSound.play();
        }
    }

    saveSounds() {
        this.restPreferencesService.saveUserPref("sounds", this.appSounds).then((data) => {
            this.toasterService.pop("info", "Settings successfully updated");

            this.soundService.setSound(this.appSounds);
        }).catch((err) => {
            this.toasterService.pop("error", "Database error", err.error.message);
        });
    }
}
