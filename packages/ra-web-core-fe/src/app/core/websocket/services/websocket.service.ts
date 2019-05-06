import * as io from "socket.io-client";
import { SocketEvent } from "../socket-events.enum";
import { WEBSOCKET_NAMESPACE_METADATA, WEBSOCKET_HAS_METADATA, WEBSOCKET_EVENT_METADATA } from "../decorators/websocket-service.decorator";
import { Reflect } from "core-js";
import { environment } from "../../../../environments/environment";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { AuthState } from "../../authentication/state/auth.state";
import { LogoutSuccess, LoginSuccess } from "../../authentication/state/auth.actions";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";

export class WebSocketService {

    protected socket: any;
    protected socketNamespace: string;

    private socketConnected = new ReplaySubject<boolean>(1);
    protected socketConnected$ = this.socketConnected.asObservable();

    private socketException = new ReplaySubject<any>(1);
    protected socketException$ = this.socketException.asObservable();

    private ioOptions = {};

    constructor(connect: boolean = true, actions: Actions, store: Store, auth: boolean = false) {
        if (store && auth) {
            const token = store.selectSnapshot(AuthState.getToken);
            this.ioOptions = {
                query: {
                    token: token
                }
            };
        }
        if (connect) {
            this.socketNamespace = Reflect.getMetadata(WEBSOCKET_NAMESPACE_METADATA, this.constructor);
            if (this.socketNamespace === undefined && connect) {
                throw new Error(`Missing namespace metadata for ${this.constructor.name}`);
            }
            this.connect(this.socketNamespace);
        }
        actions.pipe(ofActionDispatched(LogoutSuccess)).subscribe(() => {
            this.closeSocket();
        });
        actions.pipe(ofActionDispatched(LoginSuccess)).subscribe(() => {
            this.setOptions(store, auth);
            this.connect(this.socketNamespace);
        });
    }

    private bindEventHandlers() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const methodName of methodNames) {
            const method = Object.getPrototypeOf(this)[methodName];
            const hasMetadata = Reflect.getMetadata(
                WEBSOCKET_HAS_METADATA,
                method,
            );
            if (hasMetadata) {
                const socketEventName = Reflect.getMetadata(
                    WEBSOCKET_EVENT_METADATA,
                    method,
                );
                this.socket.on(socketEventName, (data) => this[methodName](data));
            }
        }
    }

    private setOptions(store: Store, auth: boolean = false) {
        if (store && auth) {
            const token = store.selectSnapshot(AuthState.getToken);
            this.ioOptions = {
                query: {
                    token: token
                }
            };
        }
    }

    public connect(namespace: string) {
        this.socketNamespace = namespace;
        this.socket = io(`${environment.wsUrl}/${this.socketNamespace}`, this.ioOptions);
        this.socket.on(SocketEvent.CONNECT, () => this.socketConnected.next(true));
        this.socket.on(SocketEvent.DISCONNECT, () => this.socketConnected.next(false));
        this.socket.on(SocketEvent.EXCEPTION, (err) => this.socketException.next(err));
        this.bindEventHandlers();
    }

    public emit(event: string, payload: any) {
        this.socket.emit(event, payload);
    }

    public closeSocket() {
        this.socket.close();
    }
}
