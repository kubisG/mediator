import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { ClientRouter } from "./interfaces/client-router.interface";
import { ClientsMap } from "./interfaces/clients-map.interface";
import { AccountsMap } from "./interfaces/accounts-map.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
export class ClientRouterService implements ClientRouter {

    private clients: ClientsMap = {};
    private accounts: AccountsMap = {};

    constructor(
        protected logger: Logger,
    ) {
    }

    private registerClient<T>(clinetId: string): Observable<T> {
        const clientSubject = new Subject<T>();
        this.clients[clinetId] = {
            subject: clientSubject,
        };
        return clientSubject.asObservable();
    }

    private registerAccount(clinetId: string, account: string): void {
        if (!this.accounts[account]) {
            this.accounts[account] = {};
        }
        this.accounts[account][clinetId] = {};
    }

    private getRegisteredClients(account: string): string[] {
        if (this.accounts[account]) {
            return Object.keys(this.accounts[account]);
        } else {
            return [];
        }
    }

    public addClientToAccount<T>(clinetId: string, account: string): Observable<T> {
        const clientSubject = this.registerClient<T>(clinetId);
        this.registerAccount(clinetId, account);
        return clientSubject;
    }

    public removeClient(clinetId: string, account?: string) {
        delete this.clients[clinetId];
        if (account) {
            delete this.accounts[account][clinetId];
        }
    }

    public pushToClient(clinetId: string, data: any) {
        const subj = this.getClientSubject(clinetId);
        if (subj) {
            subj.next(data);
        }
    }

    public pushToAccount(account: string, data: any, clients?: string[]) {
        const registeredClients = this.getRegisteredClients(account);
        for (let i = 0; i < registeredClients.length; i++) {
            if ((!clients) || (clients && clients.indexOf(registeredClients[i]) > -1)) {
                this.pushToClient(registeredClients[i], data);
            }
        }
    }

    public getClientSubject<T>(clinetId: string): Subject<T> {
        if (this.clients[clinetId]) {
            return this.clients[clinetId].subject;
        }
        this.logger.error(`Client ${clinetId} not exists!!!!`);
        return; // empty subject
//        throw new Error(`Client ${clinetId} not exists`);
    }

    public getAccountSubjects(account: string): Subject<any>[] {
        const subjects: Subject<any>[] = [];
        const registeredClients = this.getRegisteredClients(account);
        for (let i = 0; i < registeredClients.length; i++) {
            subjects.push(this.getClientSubject(registeredClients[i]));
        }
        return subjects;
    }

}
