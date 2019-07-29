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
    valueGetter?: any;
    cellRender?: any;
    sort?: string;
    allowSorting?: boolean;
    allowResizing?: boolean;
    allowHeaderFiltering?: boolean;
    allowEditing?: any;
    width?: number;
    comparator?: any;
    cellRendererFramework?: any;
    headerCheckboxSelection?: boolean;
    checkboxSelection?: boolean;
    cellEditor?: string;
    cellClass?: string;
    cellStyle?: any;
    cellEditorParams?: any;
    valueParser?: any;
    raValidators?: any;
}
