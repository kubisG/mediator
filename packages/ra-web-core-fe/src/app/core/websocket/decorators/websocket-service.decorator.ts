import { Reflect } from "core-js";
import { WsOptions } from "./ws-options.interface";

export const WEBSOCKET_NAMESPACE_METADATA = "socketNamespace";
export const WEBSOCKET_URL_METADATA = "socketUrl";
export const WEBSOCKET_EVENT_METADATA = "socketEvent";
export const WEBSOCKET_HAS_METADATA = "socketHasMetadata";

export function WebSocketSetup(options?: WsOptions): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(WEBSOCKET_NAMESPACE_METADATA, options ? options.namespace : "", target);
        Reflect.defineMetadata(WEBSOCKET_URL_METADATA, options && options.url ? options.url : "", target);
    };
}

export function WebSocketEvent(event: string): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(WEBSOCKET_HAS_METADATA, true, descriptor.value);
        Reflect.defineMetadata(WEBSOCKET_EVENT_METADATA, event, descriptor.value);
        return descriptor;
    };
}
