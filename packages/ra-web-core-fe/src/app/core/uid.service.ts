import { Injectable } from "@angular/core";
import * as fastRandom from "fast-random";

@Injectable()
export class UIDService {

    private rnd = fastRandom(new Date().getTime());

    public nextInt() {
        return Number(`${this.rnd.nextInt()}${new Date().getTime()}`);
    }

}
