import { ClientsMap } from "./clients-map.interface";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { AccountsMap } from "./accounts-map.interface";
import { ClientRouter } from "./client-router.interface";

export class ClientRouterService implements ClientRouter {

    private clients: ClientsMap = {};
    private accounts: AccountsMap = {};

    private registerClient<T>(clinetId: string): Observable<T> {
        const clientSubject = new Subject<T>();
        this.clients[clinetId] = {
            subject: clientSubject
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
        return Object.keys(this.accounts[account]);
    }

    public addClient<T>(clinetId: string, account: string): Observable<T> {
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
        this.getClientSubject(clinetId).next(data);
    }

    public pushToAccount(account: string, data: any, clients?: string[]) {
        const registeredClients = this.getRegisteredClients(account);
        for (let i = 0; i < registeredClients.length; i++) {
            if (clients && clients.indexOf(registeredClients[i]) > -1) {
                this.pushToClient(registeredClients[i], data);
            } else {
                this.pushToClient(registeredClients[i], data);
            }
        }
    }

    public getClientSubject<T>(clinetId: string): Subject<T> {
        if (this.clients[clinetId]) {
            return this.clients[clinetId].subject;
        }
        throw new Error(`Client ${clinetId} not exists`);
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
