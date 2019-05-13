import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: "root"
})
export class AuthService {

    public sendLogin: Subject<any> = new Subject<any>();
    public sendLogin$: Observable<any> = this.sendLogin.asObservable();

}
