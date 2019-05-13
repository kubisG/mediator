export class AuthStateModel {
    expiresIn?: string;
    accessToken?: string;
    payload: { [key: string]: any };
}
