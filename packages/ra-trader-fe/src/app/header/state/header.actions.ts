import { HeaderItems } from "./header-items";

// Actions
export class Load {
    static readonly type = "[Hea] Load";
    constructor(public headerItems: HeaderItems[]) { }
}

export class IncNewMessages {
    static readonly type = "[Hea] new message";
    constructor() { }
}

export class ClearMessagesCount {
    static readonly type = "[Hea] clear messages";
    constructor() { }
}

export class SetAlertMessage {
    static readonly type = "[Hea] set alert message";
    constructor(public alertMessage: string) { }
}

// Events
export class LoadCompleted {
    static type = "[Hea] LoadCompleted";
    constructor(public headerItems: any) { }
}

export class NewMessagesCount {
    static type = "[Hea] new message count";
}
