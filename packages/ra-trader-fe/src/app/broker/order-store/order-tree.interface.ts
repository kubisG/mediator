export interface OrderTree {
    items: any[];
    childs: OrderTree[];
    stored?: boolean;
    loaded?: boolean;
}
