export class PreferencesModel {
    showMeOnly: boolean;
    gtcGtd: boolean;
    rows: number;
    rowColors: {
        PendingCancel?: string,
        PendingReplace?: string,
        PendingNew?: string,
        New?: string,
        PartiallyFilled?: string,
        Filled?: string,
        Replaced?: string,
        Canceled?: string,
        DoneForDay?: string,
    };
    logging: boolean;
    theme: string;
    currency: {
        name: string,
        value: string,
    };
}
