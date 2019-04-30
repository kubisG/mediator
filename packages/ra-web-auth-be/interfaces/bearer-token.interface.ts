export interface BearerToken {
    expiresIn: number;
    accessToken: string;
    role?: string;
    rows?: number;
    theme?: string;
    id?: number;
    firstName: string;
    lastName: string;
    companyName: string;
    nickName: string;
    compId: number;
    compQueue: string;
    compQueueTrader: string;
    compQueueBroker: string;
    app: number;
    appPrefs: any;
    ClientID: string;
}
