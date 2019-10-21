CREATE TABLE IF NOT EXISTS ra_portfolio_audit as select
rap.*,
"updateDate" as "archDate",
"Symbol" as "archType"
from ra_portfolio rap where 1=0;

CREATE TABLE IF NOT EXISTS ra_order_store_audit as select
rap.*,
"updateDate" as "archDate",
"Symbol" as "archType" from ra_order_store rap where 1=0;

CREATE OR REPLACE FUNCTION raPortfolioAudit() RETURNS TRIGGER AS
$BODY$
BEGIN
       IF (TG_OP = 'DELETE') THEN

    INSERT INTO
        ra_portfolio_audit("id",
"Symbol",
"StockName",
"Account",
"FirstTrade",
"Quantity",
"BookPrice",
"createDate",
"updateDate",
"userId",
"companyId",
"RiskBeta",
"Currency",
"CurrentPrice",
"Dividend",
"CapGain",
"Custodian",
"Profit",
"archDate",
"archType")
        VALUES(old."id",
old."Symbol",
old."StockName",
old."Account",
old."FirstTrade",
old."Quantity",
old."BookPrice",
old."createDate",
old."updateDate",
old."userId",
old."companyId",
old."RiskBeta",
old."Currency",
old."CurrentPrice",
old."Dividend",
old."CapGain",
old."Custodian",
old."Profit",
now(),
TG_OP);

           RETURN old;
        ELSIF ((TG_OP = 'UPDATE') OR (TG_OP = 'INSERT')) THEN
    INSERT INTO
        ra_portfolio_audit("id",
"Symbol",
"StockName",
"Account",
"FirstTrade",
"Quantity",
"BookPrice",
"createDate",
"updateDate",
"userId",
"companyId",
"RiskBeta",
"Currency",
"CurrentPrice",
"Dividend",
"CapGain",
"Custodian",
"Profit",
"archDate",
"archType")
        VALUES(new."id",
new."Symbol",
new."StockName",
new."Account",
new."FirstTrade",
new."Quantity",
new."BookPrice",
new."createDate",
new."updateDate",
new."userId",
new."companyId",
new."RiskBeta",
new."Currency",
new."CurrentPrice",
new."Dividend",
new."CapGain",
new."Custodian",
new."Profit",
now(),
TG_OP);
           RETURN new;
        END IF;
        RETURN NULL;

END;
$BODY$
language plpgsql;

CREATE OR REPLACE FUNCTION raOrderStoreAudit() RETURNS TRIGGER AS
$BODY$
BEGIN
       IF (TG_OP = 'DELETE') THEN

    INSERT INTO
        ra_order_store_audit("id",
"OrderPackage",
"Side",
"Symbol",
"OrderQty",
"Currency",
"Text",
"TimeInForce",
"CumQty",
"LeavesQty",
"OrdStatus",
"Placed",
"TransactTime",
"ExDestination",
"Account",
"ExecInst",
"OrdType",
"JsonMessage",
"RaID",
"createDate",
"updateDate",
"userId",
"companyId",
"BookingType",
"LastQty",
"Price",
"StopPx",
"AvgPx",
"LastPx",
"ClOrdID",
"OrigClOrdID",
"Profit",
"OrderID",
"TargetCompID",
"SenderCompID",
"app",
"Allocated",
"AllocID",
"AllocRejCode",
"archDate",
"archType")
        VALUES(old."id",
old."OrderPackage",
old."Side",
old."Symbol",
old."OrderQty",
old."Currency",
old."Text",
old."TimeInForce",
old."CumQty",
old."LeavesQty",
old."OrdStatus",
old."Placed",
old."TransactTime",
old."ExDestination",
old."Account",
old."ExecInst",
old."OrdType",
old."JsonMessage",
old."RaID",
old."createDate",
old."updateDate",
old."userId",
old."companyId",
old."BookingType",
old."LastQty",
old."Price",
old."StopPx",
old."AvgPx",
old."LastPx",
old."ClOrdID",
old."OrigClOrdID",
old."Profit",
old."OrderID",
old."TargetCompID",
old."SenderCompID",
old."app",
old."Allocated",
old."AllocID",
old."AllocRejCode",
now(),
TG_OP);

           RETURN old;
        ELSIF ((TG_OP = 'UPDATE') OR (TG_OP = 'INSERT')) THEN
    INSERT INTO
        ra_order_store_audit("id",
"OrderPackage",
"Side",
"Symbol",
"OrderQty",
"Currency",
"Text",
"TimeInForce",
"CumQty",
"LeavesQty",
"OrdStatus",
"Placed",
"TransactTime",
"ExDestination",
"Account",
"ExecInst",
"OrdType",
"JsonMessage",
"RaID",
"createDate",
"updateDate",
"userId",
"companyId",
"BookingType",
"LastQty",
"Price",
"StopPx",
"AvgPx",
"LastPx",
"ClOrdID",
"OrigClOrdID",
"Profit",
"OrderID",
"TargetCompID",
"SenderCompID",
"app",
"Allocated",
"AllocID",
"AllocRejCode",
"archDate",
"archType")
        VALUES(new."id",
new."OrderPackage",
new."Side",
new."Symbol",
new."OrderQty",
new."Currency",
new."Text",
new."TimeInForce",
new."CumQty",
new."LeavesQty",
new."OrdStatus",
new."Placed",
new."TransactTime",
new."ExDestination",
new."Account",
new."ExecInst",
new."OrdType",
new."JsonMessage",
new."RaID",
new."createDate",
new."updateDate",
new."userId",
new."companyId",
new."BookingType",
new."LastQty",
new."Price",
new."StopPx",
new."AvgPx",
new."LastPx",
new."ClOrdID",
new."OrigClOrdID",
new."Profit",
new."OrderID",
new."TargetCompID",
new."SenderCompID",
new."app",
new."Allocated",
new."AllocID",
new."AllocRejCode",
now(),
TG_OP);

           RETURN new;
           END IF;
        RETURN NULL;
END;
$BODY$
language plpgsql;

DROP TRIGGER IF EXISTS ra_order_store_audit_u_trigger
 ON ra_order_store;
CREATE TRIGGER ra_order_store_audit_u_trigger AFTER UPDATE ON ra_order_store
FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*) EXECUTE PROCEDURE raOrderStoreAudit('U');

DROP TRIGGER IF EXISTS ra_portfolio_audit_u_trigger
 ON ra_portfolio;
CREATE TRIGGER ra_portfolio_audit_u_trigger AFTER UPDATE ON ra_portfolio
FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*) EXECUTE PROCEDURE raPortfolioAudit('U');

DROP TRIGGER IF EXISTS ra_order_store_audit_d_trigger
 ON ra_order_store;
CREATE TRIGGER ra_order_store_audit_d_trigger AFTER DELETE ON ra_order_store
FOR EACH ROW EXECUTE PROCEDURE raOrderStoreAudit('D');

DROP TRIGGER IF EXISTS ra_portfolio_audit_d_trigger
 ON ra_portfolio;
CREATE TRIGGER ra_portfolio_audit_d_trigger AFTER DELETE ON ra_portfolio
FOR EACH ROW EXECUTE PROCEDURE raPortfolioAudit('D');

DROP TRIGGER IF EXISTS ra_order_store_audit_i_trigger
 ON ra_order_store;
CREATE TRIGGER ra_order_store_audit_i_trigger AFTER INSERT ON ra_order_store
FOR EACH ROW EXECUTE PROCEDURE raOrderStoreAudit('I');

DROP TRIGGER IF EXISTS ra_portfolio_audit_i_trigger
 ON ra_portfolio;
CREATE TRIGGER ra_portfolio_audit_i_trigger AFTER INSERT ON ra_portfolio
FOR EACH ROW EXECUTE PROCEDURE raPortfolioAudit('I');

