CREATE TABLE
IF NOT EXISTS ra_forms_data_audit as
select
    rap.*,
    "updatedDate" as "archDate",
    "updatedBy" as "archType"
from ra_forms_data rap
where 1=0;

CREATE TABLE
IF NOT EXISTS ra_forms_spec_audit as
select
    rap.*,
    "updatedDate" as "archDate",
    "updatedBy" as "archType"
from ra_forms_spec rap
where 1=0;

CREATE TABLE
IF NOT EXISTS ra_locates_data_audit as
select
    rap.*,
    "updatedDate" as "archDate",
    "updatedBy" as "archType"
from ra_locates_data rap
where 1=0;


CREATE OR REPLACE FUNCTION raFormsDataAudit
() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF (TG_OP = 'DELETE') THEN
    INSERT INTO
        ra_forms_data_audit
        ("id",
        "dataType",
        "subType",
        "name",
        "status",
        "accounts",
        "alertMessage",
        "emailAlert",
        "emailAddress",
        "triggeredCount",
        "data",
        "wsResponse",
        "companyId",
        "createdBy",
        "updatedBy",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(
            old."id",
            old."dataType",
            old."subType",
            old."name",
            old."status",
            old."accounts",
            old."alertMessage",
            old."emailAlert",
            old."emailAddress",
            old."triggeredCount",
            old."data",
            old."wsResponse",
            old."companyId",
            old."createdBy",
            old."updatedBy",
            old."createDate",
            old."updatedDate",
            now(),
            TG_OP);
    RETURN old;
    ELSIF
    ((TG_OP = 'UPDATE') OR
    (TG_OP = 'INSERT')) THEN
    INSERT INTO
        ra_forms_data_audit
        ("id",
        "dataType",
        "subType",
        "name",
        "status",
        "accounts",
        "alertMessage",
        "emailAlert",
        "emailAddress",
        "triggeredCount",
        "data",
        "wsResponse",
        "companyId",
        "createdBy",
        "updatedBy",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(new."id",
            new."dataType",
            new."subType",
            new."name",
            new."status",
            new."accounts",
            new."alertMessage",
            new."emailAlert",
            new."emailAddress",
            new."triggeredCount",
            new."data",
            new."wsResponse",
            new."companyId",
            new."createdBy",
            new."updatedBy",
            new."createDate",
            new."updatedDate",
            now(),
            TG_OP);
    RETURN new;
END
IF;
        RETURN NULL;

END;
$BODY$
language plpgsql;


CREATE OR REPLACE FUNCTION raFormsSpecAudit
() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF (TG_OP = 'DELETE') THEN

    INSERT INTO
        ra_forms_spec_audit
        (
        "id",
        "dataType",
        "subType",
        "name",
        "spec",
        "companyId",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(
            old."id",
            old."dataType",
            old."subType",
            old."name",
            old."spec",
            old."companyId",
            old."createDate",
            old."updatedDate",
            now(),
            TG_OP);
    ELSIF
    ((TG_OP = 'UPDATE') OR
    (TG_OP = 'INSERT')) THEN
    INSERT INTO
        ra_forms_spec_audit
        ("id",
        "dataType",
        "subType",
        "name",
        "spec",
        "companyId",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(new."id",
            new."dataType",
            new."subType",
            new."name",
            new."spec",
            new."companyId",
            new."createDate",
            new."updatedDate",
            now(),
            TG_OP);
    RETURN new;
END
IF;
        RETURN NULL;
END;
$BODY$
language plpgsql;


CREATE OR REPLACE FUNCTION raLocatesDataAudit
() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF (TG_OP = 'DELETE') THEN
    INSERT INTO
        ra_locates_data_audit
        ("id",
        "reqType",
        "user",
        "symbol",
        "quantity",
        "broker",
        "comment",
        "usedShares",
        "availableShares",
        "orderId",
        "repId",
        "status",
        "poolType",
        "wsResponse",
        "companyId",
        "createdBy",
        "updatedBy",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(
            old."id",
            old."reqType",
            old."user",
            old."symbol",
            old."quantity",
            old."broker",
            old."comment",
            old."usedShares",
            old."availableShares",
            old."orderId",
            old."repId",
            old."status",
            old."poolType",
            old."wsResponse",
            old."companyId",
            old."createdBy",
            old."updatedBy",
            old."createDate",
            old."updatedDate",
            now(),
            TG_OP);
    RETURN old;
    ELSIF
    ((TG_OP = 'UPDATE') OR
    (TG_OP = 'INSERT')) THEN
    INSERT INTO
        ra_locates_data_audit
        ("id",
        "reqType",
        "user",
        "symbol",
        "quantity",
        "broker",
        "comment",
        "usedShares",
        "availableShares",
        "orderId",
        "repId",
        "status",
        "poolType",
        "wsResponse",
        "companyId",
        "createdBy",
        "updatedBy",
        "createDate",
        "updatedDate",
        "archDate",
        "archType")
    VALUES(new."id",
        new."reqType",
        new."user",
        new."symbol",
        new."quantity",
        new."broker",
        new."comment",
        new."usedShares",
        new."availableShares",
        new."orderId",
        new."repId",
        new."status",
        new."poolType",
        new."wsResponse",
        new."companyId",
        new."createdBy",
       new."updatedBy",
        new."createDate",
        new."updatedDate",
            now(),
            TG_OP);
    RETURN new;
END
IF;
        RETURN NULL;

END;
$BODY$
language plpgsql;


DROP TRIGGER IF EXISTS ra_flocates_data_audit_u_trigger
ON ra_locates_data;
CREATE TRIGGER ra_flocates_data_audit_u_trigger AFTER
UPDATE ON ra_locates_data
FOR EACH ROW
WHEN
(OLD.* IS DISTINCT FROM NEW.*)
EXECUTE PROCEDURE raLocatesDataAudit
('U');

DROP TRIGGER IF EXISTS ra_forms_data_audit_u_trigger
ON ra_forms_data;
CREATE TRIGGER ra_forms_data_audit_u_trigger AFTER
UPDATE ON ra_forms_data
FOR EACH ROW
WHEN
(OLD.* IS DISTINCT FROM NEW.*)
EXECUTE PROCEDURE raFormsDataAudit
('U');

DROP TRIGGER IF EXISTS ra_forms_spec_audit_u_trigger
ON ra_forms_spec;
CREATE TRIGGER ra_forms_spec_audit_u_trigger AFTER
UPDATE ON ra_forms_spec
FOR EACH ROW
WHEN
(OLD.* IS DISTINCT FROM NEW.*)
EXECUTE PROCEDURE raFormsSpecAudit
('U');

DROP TRIGGER IF EXISTS ra_locates_data_audit_d_trigger
ON ra_locates_data;

DROP TRIGGER IF EXISTS ra_locates_data_audit_d_trigger
ON ra_forms_data;
CREATE TRIGGER ra_locates_data_audit_d_trigger AFTER
DELETE ON ra_locates_data
FOR EACH
ROW
EXECUTE PROCEDURE raLocatesDataAudit
('D');

DROP TRIGGER IF EXISTS ra_forms_data_audit_d_trigger
ON ra_forms_data;
CREATE TRIGGER ra_forms_data_audit_d_trigger AFTER
DELETE ON ra_forms_data
FOR EACH
ROW
EXECUTE PROCEDURE raFormsDataAudit
('D');

DROP TRIGGER IF EXISTS ra_forms_spec_audit_d_trigger
ON ra_forms_spec;
CREATE TRIGGER ra_forms_spec_audit_d_trigger AFTER
DELETE ON ra_forms_spec
FOR EACH
ROW
EXECUTE PROCEDURE raFormsSpecAudit
('D');

DROP TRIGGER IF EXISTS ra_locates_data_audit_i_trigger
ON ra_locates_data;
CREATE TRIGGER ra_locates_data_audit_i_trigger AFTER
INSERT ON
ra_locates_data
FOR
EACH
ROW
EXECUTE PROCEDURE raLocatesDataAudit
('I');

DROP TRIGGER IF EXISTS ra_forms_data_audit_i_trigger
ON ra_forms_data;
CREATE TRIGGER ra_forms_data_audit_i_trigger AFTER
INSERT ON
ra_forms_data
FOR
EACH
ROW
EXECUTE PROCEDURE raFormsDataAudit
('I');

DROP TRIGGER IF EXISTS ra_forms_spec_audit_i_trigger
ON ra_forms_spec;
CREATE TRIGGER ra_forms_spec_audit_i_trigger AFTER
INSERT ON
ra_forms_spec
FOR
EACH
ROW
EXECUTE PROCEDURE raFormsSpecAudit
('I');

Insert into ra_preference ("name","value","userId","companyId","createDate","updatedDate","version","flag") values ('locates.columns','[
        {
            "fieldGroup": [
                {
                    "key": "symbol",
                    "type": "externalList",
                    "className": "flex-1",
                    "templateOptions": {
                        "label": "Symbol",
                        "required": true,
                        "multiple": false,
                        "placeholder": "Symbol",
                        "options": [],
                        "externalList": {
                            "tableName": "symbols",
                            "valueExpr": "id",
                            "displayExpr": "name"
                        }
                    },
                    "expressionProperties": {
                        "templateOptions.disabled": "model.id"
                    }
                },
                {
                    "key": "quantity",
                    "type": "input",
                    "className": "flex-1",
                    "templateOptions": {
                        "label": "Quantity",
                        "type": "number",
                        "required": true,
                        "placeholder": "Quantity"
                    }
                },
                {
                    "key": "broker",
                    "type": "externalList",
                    "className": "flex-1",
                    "templateOptions": {
                        "label": "Broker",
                        "required": true,
                        "multiple": false,
                        "placeholder": "Broker",
                        "options": [],
                        "externalList": {
                            "tableName": "brokers",
                            "valueExpr": "id",
                            "displayExpr": "name"
                        }
                    },
                    "expressionProperties": {
                        "templateOptions.disabled": "model.id"
                    }
                }
            ],
            "fieldGroupClassName": "display-flex"
        },
        {
            "key": "comment",
            "type": "input",
            "templateOptions": {
                "label": "Comment",
                "required": false,
                "placeholder": "Comment"
            }
        },
        { "hitlist": true, "caption": "Used Shares", "key": "usedShares", "type": "number" },
        { "hitlist": true, "caption": "Available Shares", "key": "availableShares", "type": "number" },
        { "hitlist": true, "caption": "Status", "key": "status", "type": "string" },
        { "hitlist": true, "caption": "Created", "key": "createDate", "type": "datepicker" },
        { "hitlist": true, "caption": "Created By", "key": "createdBy", "type": "string" },
        { "hitlist": true, "caption": "Update Date", "key": "updatedDate", "type": "datepicker" },
        { "hitlist": true, "caption": "Update By", "key": "updatedBy", "type": "string" }]',0,0,NOW(),NOW(),'2.0.1',null)
        ON CONFLICT DO NOTHING;

Insert into ra_company ("id","companyName","street","city","numInStreet","state","createDate","updatedDate","flgDel","clientId","companyMail")
values (1,'Company','Street','City','1','UK',NOW(),NOW(),null,'','support@rapidaddition.com')
ON CONFLICT DO NOTHING;

Insert into ra_user ("id","app","username","password","firstName","lastName","deskPhone","mobile","email","createDate","lastLogin","lastAction","class","flgDel","updatedDate","companyId")
values (1,1,'rapid.support','$2a$10$IpJ8uGQD9TtmypANpE/FM.1p9CsBLdGMUdA7hOgXeurwafOQ8ybklm','Admin','Support','','','support@rapidaddition.com',NOW(),null,null,'ADMIN',null,NOW(),1)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION NOTIFY_TRG() RETURNS trigger AS
$BODY$
BEGIN
  PERFORM pg_notify('locatesUpdateEvt', row_to_json(NEW)::text);
  RETURN new;
END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE COST 100;

DROP TRIGGER IF EXISTS ra_locates_update_trg
ON ra_locates_update;
CREATE TRIGGER ra_locates_update_trg
AFTER INSERT
ON ra_locates_update
FOR EACH ROW
EXECUTE PROCEDURE NOTIFY_TRG();


