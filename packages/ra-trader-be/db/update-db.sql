update ra_preference set value='{
    "Trader-NewOrderSingle": {
        "required": [
            "msgType",
            "Currency",
            "TransactTime",
            "ExDestination",
            "OrderQty",
            "Side",
            "Symbol",
            "HandlInst",
            "TimeInForce",
            "SenderCompID",
            "ClOrdID",
            "BookingType",
            "RequestType",
            "RaID"
        ],
        "optional": [
            "Limit",
           "Account",
          "SecurityDesc",
          "SettlDate",
          "ExpireDate",
            "Price",
            "CumQty",
            "OrdType",
            "OnBehalfOfSubID",            
            "ExecInst",
            "DeliverToSubID",
            "Text",          
            "OrderCapacity",
            "OrigClOrdID",
            "DeliverToCompID",
            "OnBehalfOfCompID",            
            "ClOrdLinkID",
            "LeavesQty",
            "LocateReqd",
            "OddLot",
            "SecurityID",
            "SecurityIDSource",
            "ClientID",
            "StopPx",
            "TargetCompID",
            "Commission",
            "CommType"
        ]
    },
    "Broker-ExecutionReport": {
        "required": [
            "msgType",
            "Currency",
            "OrderQty",
            "OrdStatus",
            "Side",
            "Symbol",
            "SenderCompID",
            "ClOrdID",
            "BookingType",
            "RequestType",
            "RaID"
        ],
        "optional": [
            "TimeInForce",
            "Limit",
            "TransactTime",
            "ExDestination",            
            "Account",
            "SecurityDesc",
            "SettlDate",
            "ExpireDate",                    
            "HandlInst",            
            "LastCapacity",
            "LastLiquidityInd",
            "LastMkt",
            "LastQty",
            "LastPx",
            "AvgPx",
            "Price",
            "CumQty",
            "OrdType",
            "OnBehalfOfSubID",       
            "DeliverToCompID",
            "OnBehalfOfCompID",
            "CxlRejResponseTo",
            "CxlRejReason",
            "OrdRejReason",
            "OrderID",
            "ExecID",
            "ExecTransType",
            "ExecType",
            "ExecInst",
            "ExecRefID",
            "DeliverToSubID",
            "Text",          
            "OrderCapacity",
            "OrigClOrdID",
            "ClOrdLinkID",
            "LeavesQty",
            "LocateReqd",
            "SecurityID",
            "SecurityIDSource",
            "ClientID",
            "StopPx",
            "TargetCompID",
            "Commission",
            "CommType"            
        ]
    },   
    "Broker-OrderCancelReject": {
        "required": [
            "RaID",
            "ClientID",
            "SenderCompID",
            "DeliverToCompID",
            "OnBehalfOfCompID",
            "RequestType",
            "ClOrdID",
            "OrdStatus",
            "TransactTime",
            "OrderID",
            "msgType",
            "TargetCompID",
            "OrigClOrdID",
            "CxlRejResponseTo",
            "CxlRejReason"
        ],
        "optional": []
    },
    "Trader-OrderCancelReplaceRequest": {
        "required": [
            "msgType",
            "ExDestination",
            "OrderQty",
            "TimeInForce",
            "RequestType",
            "HandlInst",
            "RaID"
        ],
        "optional": [
            "Limit",
            "TransactTime",
            "Currency",
            "Account",
            "SecurityDesc",
            "Price",
            "SettlDate",
            "ExpireDate",            
            "OnBehalfOfSubID",
            "OrderID",
            "ClOrdID",
            "ClOrdLinkID",            
            "ExecInst",            
            "OrderCapacity",            
            "OrdType",            
            "BookingType",
            "OrigClOrdID",
            "Text",            
            "DeliverToSubID",
            "Side",
            "Symbol",
            "ClientID",
            "StopPx",            
            "SecurityID",
            "SecurityIDSource",
            "SenderCompID",
            "TargetCompID",
            "Commission",
            "CommType"            
        ]
    },    
    "Trader-OrderCancelRequest": {
        "required": [
            "msgType",
            "OrderQty",
            "RequestType",
            "RaID"
        ],
        "optional": [
            "TransactTime",
            "OrderID",
            "ClOrdID",
            "ClOrdLinkID",            
            "OrigClOrdID",
            "DeliverToSubID",
            "OnBehalfOfSubID",            
            "Side",
            "Symbol",
            "ClientID",
            "SenderCompID",
            "TargetCompID"
        ]
    },    
    "Alloc-AllocationInstruction":{
        "required": [
            "msgType",
            "AllocID",
            "AllocTransType",
            "Side",
            "TradeDate",
            "AvgPx",
            "Symbol",
            "ClOrdID",
            "RequestType",
            "RaID"
        ],
        "optional": [
            "AllocAccount",
            "Currency",
            "Shares",
            "AllocText",
            "AllocStatus",
            "OrderID",
            "RefAllocID",
            "TradeDate",
            "SecurityID",
            "SecurityIDSource",
            "SenderCompID",            
            "TargetCompID",
            "DeliverToSubID",
            "ExDestination",
            "AllocRejCode"
        ]
    },
    "AllocRow-AllocationInstruction":{
        "required": [
            "AllocShares",
            "AllocAccount"
        ],
        "optional": [
            "AllocText"
        ]
    },  
    "AllocInst-AllocationInstruction":{
        "required": [
            "msgType",
            "AllocID",
            "TradeDate",
            "AllocStatus",
            "ClOrdID"

        ],
        "optional": [
            "AllocText",
            "SenderCompID",            
            "TargetCompID",
            "AllocRejCode",
            "ClientID"
        ]
    },
    "Trader-IOI": {
        "required": [
            "msgType",
            "ExDestination",
            "IOIid",
            "Side",
            "company",
            "Symbol",
            "RequestType",
            "RaID"
        ],
        "optional": [
            "IOITransType",
            "TransactTime",
            "Currency",
            "IOIQty",
            "Text",         
            "Price",            
            "ValidUntilTime",
            "ClOrdID",            
            "SecurityDesc",
            "SecurityID",
            "SecurityIDSource",
            "SenderCompID",
            "IOIRefID",
            "userId",
            "TargetCompID"
        ]
    }    
}' where name like 'messageFilters';



update ra_preference set value='["BookingType",ExDestination", "Side","OrdType","Symbol","Currency","ExecInst","TimeInForce","OrderCapacity","SecurityID","SecurityDesc","SecurityIDSource","DeliverToSubID","TargetCompID","Reject","AllocRejCode", "CommType", "LastCapacity","HandlInst"]' where name like 'order_store_lists';

update ra_preference set value='[{ "dataField": "Symbol", "showInColumnChooser": true, "allowEditing": false },
{ "dataField": "StockName", "showInColumnChooser": true, "allowEditing": false },
{ "dataField": "user.username", "caption": "Username","showInColumnChooser": true, "allowEditing": false},
{ "dataField": "Account", "showInColumnChooser": true, "allowEditing": false },
{ "caption": "Portfolio %", "showInColumnChooser": true, "calculateCell": "portfolio", "allowEditing": false, "format": { "type": "percent", "precision": 2 }, "showInColumnChooser": true },
{ "dataField": "RiskBeta", "caption": "Beta", "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "showInColumnChooser": true, "cssClass": "editable-td" },
{ "dataField": "FirstTrade", "caption": "1st trade", "dataType": "date", "format": "y/MM/dd HH:mm:ss.S", "allowEditing": false },
{ "dataField": "Quantity", "dataType": "number", "showInColumnChooser": true, "allowEditing": false },
{ "dataField": "BookPrice", "showInColumnChooser": true, "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false},
{ "dataField": "Currency", "caption": "Ccy", "showInColumnChooser": true, "allowEditing": false },
{ "caption": "BookValueLocal", "showInColumnChooser": true, "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false, "calculateCell": "bookvalloc"},
{ "caption": "BookValue", "showInColumnChooser": true, "dataType": "number", "formatMoney": true, "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false, "calculateCell": "bookval"},
{ "dataField": "CurrentPrice", "showInColumnChooser": true, "templateCell": "currPrice", "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "cssClass": "editable-td"},
{ "caption": "CurrentValueLocal", "showInColumnChooser": true, "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false, "calculateCell": "curvalloc"},
{ "caption": "CurrentValue", "showInColumnChooser": true, "dataType": "number", "formatMoney": true, "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false, "calculateCell": "curval"},
{ "caption": "Unrlzd PL local", "showInColumnChooser": true, "calculateCell": "unrlzdloc", "format": { "type": "fixedPoint", "precision": 2 }, "allowEditing": false },
{ "caption": "Unrlzd PL", "showInColumnChooser": true, "calculateCell": "unrlzd","formatMoney": true, "format": { "type": "fixedPoint", "precision": 2 }, "allowEditing": false },
{ "dataField": "CapGain", "caption":  "Cap gain",  "showInColumnChooser": true, "cssClass": "editable-td"},
{ "dataField": "Dividend", "caption": "Dividend yield %", "dataType": "number", "format": {"type": "fixedPoint", "precision": 2 }, "showInColumnChooser": true, "cssClass": "editable-td"},
{ "caption": "Unlrzd PL%", "showInColumnChooser": true, "calculateCell": "unrlzdpct", "format": { "type": "percent", "precision": 2 }, "allowEditing": false },
{ "dataField": "Profit","caption": "Profit", "dataType": "number", "formatMoney": true, "format": {"type": "fixedPoint", "precision": 2 }, "allowEditing": false, "showInColumnChooser": true, "calculateCell": "profit" },
{ "dataField": "Custodian", "caption":  "Custodian",  "showInColumnChooser": true, "cssClass": "editable-td"}
]' where name like 'portfolio_columns';


update ra_preference set value='[
    {
        "dataField": "Checkbox",
        "showInColumnChooser": false,
        "allowEditing": false,
        "allowExporting": false,
        "allowFixing": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowHiding": false,
        "allowReordering": false,
        "allowResizing": false,
        "allowSorting": false,
        "fixed": true,
        "fixedPosition": "left",
        "templateCell": "checkbox",
        "headerCellTemplate": "checkboxHeader",
        "width": 25
    },
    {
        "dataField": "Placed",
        "dataType": "date",
        "format": "HH:mm:ss.S",
        "allowEditing": false
    },
    {
        "dataField":"TransactTime","caption":"Latest",
        "dataType": "date",
        "format": "HH:mm:ss.S",
        "allowEditing": false
    },
    {
        "dataField": "Actions",
        "showInColumnChooser": false,
        "templateCell": "actions",
        "fixed": true,
        "allowEditing": false,
        "allowExporting": false,
        "allowFixing": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowHiding": false,
        "allowReordering": false,
        "allowResizing": false,
        "allowSorting": false,
        "fixedPosition": "right",
        "minWidth": 125
    },
    {
        "dataField": "Side",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "Symbol",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "SecurityID",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "SecurityIDSource",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "ProgressBar",
        "showInColumnChooser": true,
        "templateCell": "graph",
        "allowEditing": false,
        "allowExporting": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowSorting": false
    },      
    {
        "dataField": "CumQty",
        "caption":"Filled Qty",
        "dataType": "number",
        "showInColumnChooser": true,
        "allowEditing": false
    },
    {
        "dataField": "AvgPx",
        "showInColumnChooser": true,
        "dataType": "number",
        "allowEditing": false,
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "LeavesQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true
    },
    {
        "dataField": "LastPx",
        "showInColumnChooser": true,
        "allowEditing": false,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "LastQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true
    },
    {
        "dataField": "OrderQty",
        "dataType": "number",
        "showInColumnChooser": true
    },
    {
        "dataField": "OrdType",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "Price",
        "showInColumnChooser": true,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "TimeInForce",
        "caption": "TIF",
        "showInColumnChooser": true,
        "visible": true,
        "dataType": "string",
        "lookup": true
    },
    {
        "dataField": "StopPx",
        "showInColumnChooser": true,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "HandlInst",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "OrdStatus",
        "showInColumnChooser": true,
        "allowEditing": false,
        "lookup": true
    },
    {
        "dataField": "Currency",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "ExpireDate",
        "dataType": "date",
        "visible": false,
        "format": "y/MM/dd"
    },
    {
        "dataField": "SettlDate",
        "dataType": "date",
        "visible": false,
        "format": "y/MM/dd"
    },
    {
        "dataField": "OddLot",
        "showInColumnChooser": true,
        "dataType": "bool",
        "visible": false
    },
    {
        "dataField": "Rule80A",
        "showInColumnChooser": true,
        "dataType": "bool", 
        "visible": false
    },
    {
        "dataField": "MaturityMonthYear",
        "showInColumnChooser": true,
        "dataType": "string", 
        "visible": false
    },
    {
        "dataField": "Commission",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "CommType",
        "showInColumnChooser": true,
        "lookup": true,
        "visible": false
    },
    {
        "dataField": "TargetCompID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ExDestination",
        "showInColumnChooser": true,
        "visible": false,
        "lookup": true
    },
    {
        "dataField": "DeliverToSubID",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "Text",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "OpenClose",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "PutOrCall",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "MaturityDay",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "StrikePrice",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "ExecInst",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false,
        "lookup": true
    },
    {
        "dataField": "Account",
        "showInColumnChooser": true,
        "visible": false,
        "lookup2": true
    },
    {
        "dataField": "LastMkt",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ClOrdID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ClientID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "PartyID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "OrderID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "MinQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "LocateReqd",
        "showInColumnChooser": true,
        "dataType": "bool",
        "visible": false
    }
]' where name like 'broker_store_columns';

delete from ra_preference where name = 'hitlist_broker';
Insert into ra_preference
    ("name","value","userId","companyId","createDate","updatedDate")
values
    ('hitlist_broker', '{"columns":[{"visibleIndex":0,"dataField":"Checkbox","width":25,"visible":true,"fixed":true,"fixedPosition":"left"},{"visibleIndex":11,"dataField":"Placed","dataType":"date","width":70,"visible":true,"sortOrder":"desc","sortIndex":0},{"visibleIndex":12,"dataField":"TransactTime","dataType":"date","width":73,"visible":true},{"visibleIndex":1,"dataField":"Actions","visible":true,"fixed":true,"fixedPosition":"right"},{"visibleIndex":2,"dataField":"Side","dataType":"lookup","width":43,"visible":true},{"visibleIndex":4,"dataField":"Symbol","dataType":"lookup","width":50,"visible":true},{"visibleIndex":9,"dataField":"SecurityID","dataType":"lookup","visible":false},{"visibleIndex":10,"dataField":"SecurityIDSource","dataType":"lookup","visible":false},{"visibleIndex":16,"dataField":"ProgressBar","width":105,"visible":true},{"visibleIndex":14,"dataField":"CumQty","dataType":"number","width":79,"visible":true},{"visibleIndex":15,"dataField":"AvgPx","dataType":"number","width":67,"visible":true},{"visibleIndex":17,"dataField":"LeavesQty","dataType":"number","width":56,"visible":true},{"visibleIndex":18,"dataField":"LastPx","dataType":"number","width":68,"visible":true},{"visibleIndex":19,"dataField":"LastQty","dataType":"number","width":69,"visible":true},{"visibleIndex":3,"dataField":"OrderQty","dataType":"number","width":75,"visible":true},{"visibleIndex":5,"dataField":"OrdType","dataType":"lookup","width":49,"visible":true},{"visibleIndex":6,"dataField":"Price","dataType":"number","width":68,"visible":true},{"visibleIndex":7,"dataField":"TimeInForce","dataType":"lookup","width":46,"visible":true},{"visibleIndex":8,"dataField":"StopPx","dataType":"number","width":64,"visible":true},{"visibleIndex":23,"dataField":"HandlInst","dataType":"lookup","width":83,"visible":true},{"visibleIndex":13,"dataField":"OrdStatus","dataType":"lookup","width":102,"visible":true},{"visibleIndex":22,"dataField":"Currency","dataType":"lookup","width":81,"visible":true},{"visibleIndex":24,"dataField":"ExpireDate","dataType":"date","width":101,"visible":true},{"visibleIndex":25,"dataField":"SettlDate","dataType":"date","width":85,"visible":true},{"visibleIndex":26,"dataField":"OddLot","dataType":"bool","width":87,"visible":true},{"visibleIndex":27,"dataField":"Rule80A","dataType":"bool","width":81,"visible":true},{"visibleIndex":30,"dataField":"Commission","dataType":"string","width":89,"visible":true},{"visibleIndex":31,"dataField":"CommType","dataType":"lookup","width":88,"visible":true},{"visibleIndex":32,"dataField":"DeliverToCompID","dataType":"string","width":129,"visible":true},{"visibleIndex":33,"dataField":"OnBehalfOfCompID","dataType":"string","width":96,"visible":true},{"visibleIndex":34,"dataField":"ExDestination","dataType":"lookup","width":83,"visible":true},{"visibleIndex":35,"dataField":"DeliverToSubID","width":106,"visible":true},{"visibleIndex":21,"dataField":"Text","dataType":"string","width":119,"visible":true},{"visibleIndex":36,"dataField":"OpenClose","visible":false},{"visibleIndex":37,"dataField":"PutOrCall","visible":false},{"visibleIndex":38,"dataField":"MaturityDay","visible":false},{"visibleIndex":39,"dataField":"StrikePrice","visible":false},{"visibleIndex":20,"dataField":"ExecInst","dataType":"lookup","width":92,"visible":true},{"visibleIndex":29,"dataField":"Account","dataType":"lookup","width":90,"visible":true},{"visibleIndex":28,"dataField":"LastMkt","width":96,"visible":true},{"visibleIndex":40,"dataField":"ClOrdID","dataType":"string","width":88,"visible":true},{"visibleIndex":41,"dataField":"ClientID","dataType":"string","width":87,"visible":true},{"visibleIndex":42,"dataField":"PartyID","width":77,"visible":true},{"visibleIndex":43,"dataField":"OrderID","dataType":"string","width":311,"visible":true},{"visibleIndex":44,"dataField":"MinQty","dataType":"number","width":51,"visible":true},{"visibleIndex":45,"dataField":"LocateReqd","dataType":"bool","width":129,"visible":true},{"visibleIndex":46,"dataField":"StockCode","visible":false},{"visibleIndex":47,"dataField":"BasketName","width":88,"visible":true},{"visibleIndex":48,"dataField":"SecurityExchange","visible":false},{"visibleIndex":49,"dataField":"ManagerName","visible":false},{"visibleIndex":50,"dataField":"DealType","visible":false},{"visibleIndex":51,"dataField":"SSFMaturityDate","visible":false},{"visibleIndex":52,"dataField":"SSFTradeType","visible":false},{"visibleIndex":53,"dataField":"SBSADayTrade","visible":false},{"visibleIndex":54,"dataField":"UnwindID","visible":false},{"visibleIndex":55,"dataField":"Disclosed","width":78,"visible":true},{"visibleIndex":56,"dataField":"PrimeBrokerCode","width":114,"visible":true},{"visibleIndex":57,"dataField":"TargetSubID","width":93,"visible":true},{"visibleIndex":58,"dataField":"ClientCode","width":93,"visible":true},{"visibleIndex":59,"dataField":"MinExecSize","width":83,"visible":true},{"visibleIndex":60,"dataField":"StrategyCode","visible":false},{"visibleIndex":61,"dataField":"ValueFlag","visible":false},{"visibleIndex":62,"dataField":"Value%","visible":false},{"visibleIndex":63,"dataField":"Functions","visible":false},{"visibleIndex":64,"dataField":"SettlementType","visible":false},{"visibleIndex":65,"dataField":"SubID","visible":false},{"visibleIndex":66,"dataField":"DeskName","width":721,"visible":true}],"searchText":"","pageIndex":0,"pageSize":"15","allowedPageSizes":[50,"100",200],"filterPanel":{"filterEnabled":true},"filterValue":null,"selectedRowKeys":[]}', 0, 0, NOW(), NOW());



update ra_preference set value='[
    {
        "dataField": "Checkbox",
        "showInColumnChooser": false,
        "allowEditing": false,
        "allowExporting": false,
        "allowFixing": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowHiding": false,
        "allowReordering": false,
        "allowResizing": false,
        "allowSorting": false,
        "fixed": true,
        "fixedPosition": "left",
        "templateCell": "checkbox",
        "headerCellTemplate": "checkboxHeader",
        "width": 25
    },
    {
        "dataField": "Placed",
        "dataType": "date",
        "format": "HH:mm:ss.S",
        "allowEditing": false
    },
    {
        "dataField":"TransactTime","caption":"Latest",
        "dataType": "date",
        "format": "HH:mm:ss.S",
        "allowEditing": false
    },
    {
        "dataField": "Actions",
        "showInColumnChooser": false,
        "templateCell": "actions",
        "fixed": true,
        "allowEditing": false,
        "allowExporting": false,
        "allowFixing": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowHiding": false,
        "allowReordering": false,
        "allowResizing": false,
        "allowSorting": false,
        "fixedPosition": "right",
        "minWidth": 125        
    },
    {
        "dataField": "Side",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "Symbol",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "SecurityID",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "SecurityIDSource",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "ProgressBar",
        "showInColumnChooser": true,
        "templateCell": "graph",
        "allowEditing": false,
        "allowExporting": false,
        "allowGrouping": false,
        "allowHeaderFiltering": false,
        "allowSorting": false
    },     
    {
        "dataField": "CumQty",
        "caption": "Filled Qty",        
        "dataType": "number",
        "showInColumnChooser": true,
        "allowEditing": false
    },
    {
        "dataField": "AvgPx",
        "showInColumnChooser": true,
        "dataType": "number",
        "allowEditing": false,
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "LeavesQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true
    },
    {
        "dataField": "LastPx",
        "showInColumnChooser": true,
        "allowEditing": false,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "LastQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true
    },
    {
        "dataField": "OrderQty",
        "dataType": "number",
        "showInColumnChooser": true
    },
    {
        "dataField": "OrdType",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "Price",
        "showInColumnChooser": true,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "TimeInForce",
        "caption": "TIF",
        "showInColumnChooser": true,
        "visible": true,
        "dataType": "string",
        "lookup": true
    },
    {
        "dataField": "StopPx",
        "showInColumnChooser": true,
        "dataType": "number",
        "format": {
            "type": "fixedPoint",
            "precision": 2
        }
    },
    {
        "dataField": "HandlInst",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "OrdStatus",
        "showInColumnChooser": true,
        "allowEditing": false,
        "lookup": true
    },
    {
        "dataField": "Currency",
        "showInColumnChooser": true,
        "lookup": true
    },
    {
        "dataField": "ExpireDate",
        "dataType": "date",
        "visible": false,
        "format": "y/MM/dd"
    },
    {
        "dataField": "SettlDate",
        "dataType": "date",
        "visible": false,
        "format": "y/MM/dd"
    },
    {
        "dataField": "OddLot",
        "showInColumnChooser": true,
        "dataType": "bool",
        "visible": false
    },
    {
        "dataField": "Rule80A",
        "showInColumnChooser": true,
        "dataType": "bool",
        "visible": false
    },
    {
        "dataField": "Commission",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "CommType",
        "showInColumnChooser": true,
        "lookup": true,
        "visible": false
    },
    {
        "dataField": "DeliverToCompID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "OnBehalfOfCompID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ExDestination",
        "showInColumnChooser": true,
        "visible": false,
        "lookup": true
    },
    {
        "dataField": "DeliverToSubID",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "Text",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "PutOrCall",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "OpenClose",
        "showInColumnChooser": true,
        "visible": false
    },    
    {
        "dataField": "MaturityDay",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "MaturityMonthYear",
        "showInColumnChooser": true,
        "dataType": "string", 
        "visible": false
    },    
    {
        "dataField": "StrikePrice",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "ExecInst",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false,
        "lookup": true
    },
    {
        "dataField": "Account",
        "showInColumnChooser": true,
        "visible": false,
        "lookup2": true
    },
    {
        "dataField": "LastMkt",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ClOrdID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "ClientID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "PartyID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "OrderID",
        "showInColumnChooser": true,
        "allowEditing": false,
        "visible": false
    },
    {
        "dataField": "MinQty",
        "dataType": "number",
        "allowEditing": false,
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "LocateReqd",
        "showInColumnChooser": true,
        "dataType": "bool",
        "visible": false
    },
    {
        "dataField": "StockCode",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "BasketName",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SecurityExchange",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "ManagerName",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "DealType",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SSFMaturityDate",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SSFTradeType",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SBSADayTrade",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "UnwindID",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "Disclosed",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "PrimeBrokerCode",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "TargetSubID",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "ClientCode",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "MinExecSize",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "StrategyCode",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "ValueFlag",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "Value%",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "Functions",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SettlementType",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "SubID",
        "showInColumnChooser": true,
        "visible": false
    },
    {
        "dataField": "DeskName",
        "showInColumnChooser": true,
        "visible": false
    }
]' where name = 'order_store_columns';

DELETE FROM ra_preference WHERE name IN ('layout_settings-default','layout_diagnostic-default','layout_trader-default','layout_broker-default', 'layout_admin-default') and "userId"=0 and "companyId"=0;
Insert into ra_preference
    ("name","value","userId","companyId","createDate","updatedDate")
values
    ('layout_settings-default', '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":true,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":50,"content":[{"type":"stack","isClosable":false,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":70.45364891518737,"content":[{"type":"component","componentName":"ra-settings","title":"User","isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":29.546351084812628,"content":[{"type":"component","componentName":"ra-sounds","title":"Sounds","isClosable":true,"reorderEnabled":true}]}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":2,"height":50,"content":[{"type":"component","componentName":"ra-company-wide","title":"Company","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-counter-party","title":"Counter Parties","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-accounts","title":"Accounts","isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}', 0, 0, NOW(), NOW());
Insert into ra_preference
    ("name","value","userId","companyId","createDate","updatedDate")
values
    ('layout_diagnostic-default', '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":true,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"type":"component","componentName":"ra-diag-server","title":"Server","isClosable":true,"reorderEnabled":true}]},{"type":"stack","isClosable":false,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"type":"component","componentName":"ra-diag-hub","title":"Hub connections","isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}', 0, 0, NOW(), NOW());
Insert into ra_preference
    ("name","value","userId","companyId","createDate","updatedDate")
values
    ('layout_trader-default', '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":true,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":90.80867850098619,"content":[{"type":"stack","isClosable":false,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":90.80867850098619,"height":68.21319259242912,"content":[{"type":"component","componentName":"ra-blotter-store","title":"Blotter","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-trader-order-import","title":"Import Order","isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":31.786807407570876,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":31.786807407570876,"width":51.56657963446475,"content":[{"type":"component","componentName":"ra-trader-order-tree","title":"Message Tree","isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":48.43342036553525,"content":[{"type":"component","componentName":"ra-order-fills","title":"Order Fills","isClosable":true,"reorderEnabled":true}]}]}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":9.191321499013805,"content":[{"type":"component","componentName":"ra-trader-order-detail","title":"Properties","isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}', 0, 0, NOW(), NOW());
Insert into ra_preference
    ("name","value","userId","companyId","createDate","updatedDate")
values
    ('layout_broker-default', '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":true,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":65.8142171795945,"content":[{"type":"stack","isClosable":false,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":57.96242531852101,"width":65.8142171795945,"content":[{"type":"component","componentName":"ra-order-store","title":"Order store","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-split-store","title":"Split Order","isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"height":42.03757468147899,"content":[{"type":"component","componentName":"ra-phone-store","title":"Manual Order","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-broker-order-import","title":"Import Order","isClosable":true,"reorderEnabled":true}]}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":34.185782820405514,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"height":45.61675717610551,"content":[{"type":"component","componentName":"ra-broker-order-detail-dialog","title":"Detail","isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":54.383242823894484,"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":74.21602787456446,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":74.21602787456446,"height":50,"content":[{"type":"component","componentName":"ra-broker-sleuth-grid-dialog","title":"Sleuth Grid","isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"type":"component","componentName":"ra-broker-order-tree","title":"Message Tree","isClosable":true,"reorderEnabled":true}]}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":25.78397212543554,"height":54.383242823894484,"content":[{"type":"component","componentName":"ra-broker-order-detail","title":"Properties","isClosable":true,"reorderEnabled":true}]}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}', 0, 0, NOW(), NOW());
Insert into ra_preference    
values
    ('layout_admin-default', '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":true,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"stack","isClosable":false,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"type":"component","componentName":"ra-companies","title":"Companies","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-users","title":"Users","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-input-rules","title":"Data settings","isClosable":true,"reorderEnabled":true},{"type":"component","componentName":"ra-preferences","title":"Preferences","isClosable":true,"reorderEnabled":true}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}', 0, 0, NOW(), NOW());


delete from ra_preference where name like 'portfolio_sum_columns';
Insert into ra_preference ("name","value","userId","companyId","createDate","updatedDate") values ('portfolio_sum_columns','{"totalItems": [{"column": "Symbol", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true},
                {"column": "StockName", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "Username", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "Account", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "Portfolio %", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"showInColumn": "RiskBeta","column": "RiskBeta","summaryType": "avg", "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"}, 
                {"column": "FirstTrade", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "Quantity", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "BookPrice", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "Currency", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "BookValueLocal", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"showInColumn": "BookValue","column": "BookValue","summaryType": "sum", "formatMoney": true, "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"},
                {"column": "CurrentPrice", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"column": "CurrentValueLocal", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"showInColumn": "CurrentValue", "column": "CurrentValue","summaryType": "sum", "formatMoney": true, "currentVal": true, "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"},
                {"column": "Unlrzd PL local", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"showInColumn": "Unlrzd PL", "column": "Unlrzd PL","summaryType": "sum", "formatMoney": true, "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"},
                {"column": "CapGain", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true },
                {"showInColumn": "Dividend", "column": "Dividend","summaryType": "avg", "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"},                
                {"showInColumn": "Unlrzd PL%","column": "Unlrzd PL%","summaryType": "avg", "valueFormat": { "type": "percent", "precision": 2 }, "displayFormat": "{0}"},
                {"showInColumn": "Profit", "column": "Profit","summaryType": "sum", "formatMoney": true, "valueFormat": { "type": "fixedPoint", "precision": 2 }, "displayFormat": "{0}"},
                { "column": "Custodian", "summaryType": "count" , "displayFormat": "{0}", "clearValue": true }
                ]}',0,0,NOW(),NOW());
