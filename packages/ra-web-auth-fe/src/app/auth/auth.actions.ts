export class Login {
    static readonly type = "[Auth] Login";
    constructor(
        public email: string,
        public password: string,
    ) { }
}

export class Logout {
    static readonly type = "[Auth] Logout";
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

