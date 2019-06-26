export interface GridColumn {

    dataField: string;
    caption?: string;
    enableRowGroup?: boolean;
    allowedAggFuncs?: string[];
    aggFunc?: string;

}
