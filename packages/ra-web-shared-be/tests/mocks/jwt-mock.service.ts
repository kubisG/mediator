export class JwtMockService {

    sign(payload: string | Object | Buffer, options?: any): string {
        return "signed";
    }

    verify<T>(token: string, options?: any): any {
        return {};
    }

    decode(token: string, options: any): any {
        return {};
    }
}
