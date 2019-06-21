import * as io from "socket.io-client";
import { SocketEvent } from "../socket-events.enum";
import {
    WEBSOCKET_NAMESPACE_METADATA,
    WEBSOCKET_HAS_METADATA,
    WEBSOCKET_EVENT_METADATA,
    WEBSOCKET_URL_METADATA
} from "../decorators/websocket-service.decorator";
import { Reflect } from "core-js";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { AuthState } from "../../auth/state/auth.state";
import { LogoutSuccess, LoginSuccess } from "../../auth/auth.actions";

export abstract class WebSocketService {

    protected socket: any;
    protected socketNamespace: string;
    protected socketUrl: string;

    private socketConnected = new ReplaySubject<boolean>(1);
    protected socketConnected$ = this.socketConnected.asObservable();

    private socketException = new ReplaySubject<any>(1);
    protected socketException$ = this.socketException.asObservable();

    private ioOptions = {};

    constructor(connect: boolean = true, actions: Actions, store: Store, auth: boolean = false) {
        this.setAuth(store, auth);
        this.autoConnect(connect);
        actions.pipe(ofActionDispatched(LogoutSuccess)).subscribe(() => {
            this.closeSocket();
        });
        actions.pipe(ofActionDispatched(LoginSuccess)).subscribe(() => {
            this.setOptions(store, auth);
            this.connect(this.socketNamespace, this.socketUrl);
        });
    }

    private autoConnect(connect: boolean) {
        if (connect) {
            this.socketNamespace = Reflect.getMetadata(WEBSOCKET_NAMESPACE_METADATA, this.constructor);
            this.socketUrl = Reflect.getMetadata(WEBSOCKET_URL_METADATA, this.constructor);
            if (this.socketNamespace === undefined && connect) {
                throw new Error(`Missing namespace metadata for ${this.constructor.name}`);
            }
            this.connect(this.socketNamespace, this.socketUrl);
        }
    }

    private setAuth(store: Store, auth: boolean = false) {
        if (store && auth) {
            const token = store.snapshot().auth.accessToken;
            this.ioOptions = {
                pingTimeout: 5000,
                query: {
                    token
                }
            };
        }
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
                pingTimeout: 5000,
                query: {
                    token
                }
            };
        }
    }

    public connect(namespace: string, url?: string) {
        this.socketNamespace = namespace;
        this.socket = io(`${url ? url : ""}/${this.socketNamespace}`, this.ioOptions);
        this.socket.on(SocketEvent.CONNECT, () => {
            this.socketConnected.next(true);
            this.onConnect();
        });
        this.socket.on(SocketEvent.DISCONNECT, () => {
            this.socketConnected.next(false);
            this.onDisconnect();
        });
        this.socket.on(SocketEvent.EXCEPTION, (err) => {
            this.socketException.next(err);
            this.onError(err);
        });
        this.bindEventHandlers();
    }

    public emit(event: string, payload: any) {
        this.socket.emit(event, payload);
    }

    public closeSocket() {
        this.socket.close();
    }

    public onConnect() {

    }

    public onDisconnect() {

    }

    public onError(err: any) {

    }
}
