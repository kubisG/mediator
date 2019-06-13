export interface AuthApi {
    login(email: string, password: string): Promise<any>;

    logout(): Promise<any>;
}
