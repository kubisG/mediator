export class Login {
    static readonly type = "[Auth] Login";
    constructor(
        public email: string,
        public password: string,
        public role?: string,
        public rows?: number,
    ) { }
}

export class Logout {
    static readonly type = "[Auth] Logout";
}

export class SetPrefs {
    static readonly type = "[Auth] PrefsSetting";
    constructor(
        public rows?: number,
        public rowColors?: {}
    ) { }
}

// Events
export class LoginRedirect {
    static type = "[Auth] LoginRedirect";
}

export class LoginSuccess {
    static type = "[Auth] LoginSuccess";
    constructor(public user: any) { }
}

export class LoginFailed {
    static type = "[Auth] LoginFailed";
    constructor(public error: any) { }
}

export class LogoutSuccess {
    static type = "[Auth] LogoutSuccess";
    constructor(public user: any) { }
}

