import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";

export interface ClientRouter {

    addClient<T>(clinetId: string, account: string): Observable<T>;

    removeClient(clinetId: string, account?: string): void;

    pushToClient(clinetId: string, data: any): void;

    pushToAccount(account: string, data: any, clients?: string[]): void;

    getClientSubject<T>(clinetId: string): Subject<T>;

    getAccountSubjects(account: string): Subject<any>[];

}
