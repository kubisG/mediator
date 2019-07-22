export interface GridColumn {

    dataField: string;
    caption?: string;
    enableRowGroup?: boolean;
    allowedAggFuncs?: string[];
    aggFunc?: string;
    rowGroup?: boolean;
    type?: string | string[];
    pinned?: string;
    lockPosition?: boolean;
    lockVisible?: boolean;
    lockPinned?: boolean;
    valueFormatter?: any;
    cellRender?: any;
    allowSorting?: boolean;
    allowResizing?: boolean;
    allowHeaderFiltering?: boolean;
    allowEditing?: boolean;
    width?: number;
    comparator?: any;
    cellRendererFramework?: any;
    headerCheckboxSelection?: boolean;
    checkboxSelection?: boolean;
    cellEditor?: string;
    cellClass?: string;
    cellEditorParams?: any;
    valueParser?: any;

}
