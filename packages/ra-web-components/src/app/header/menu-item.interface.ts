export interface MenuItem {
    route?: string;
    icon?: string;
    label: string;
    data?: any;
    divider?: boolean;
    class?: string;
    single?: boolean;
    subItems?: MenuItem[];
    default?: boolean;
}
