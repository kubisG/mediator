import { Reflect } from "core-js";

export const WEBSOCKET_NAMESPACE_METADATA = "socketNamespace";
export const WEBSOCKET_EVENT_METADATA = "socketEvent";
export const WEBSOCKET_HAS_METADATA = "socketHasMetadata";

export function WebSocketSetup(options?: { namespace: string }): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(WEBSOCKET_NAMESPACE_METADATA, options ? options.namespace : "", target);
    };
}

export function WebSocketEvent(event: string): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(WEBSOCKET_HAS_METADATA, true, descriptor.value);
        Reflect.defineMetadata(WEBSOCKET_EVENT_METADATA, event, descriptor.value);
        return descriptor;
    };
}
