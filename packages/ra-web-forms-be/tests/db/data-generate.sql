insert into ra_company("companyName", "street", "city", "numInStreet", "state", "createDate", "updateDate", "flgDel", "clientId", "companyMail")
select "companyName"||'a'||n, "street", "city", "numInStreet", "state", NOW(), NOW(), "flgDel", "clientId"||'a'||n, "companyMail" from (
select * from ra_company JOIN (
SELECT a.n
from generate_series(1, 3000) as a(n)) B ON TRUE) as B;

insert into ra_user("app", "username", "password", "firstName", "lastName", "email", "createDate", "updatedDate", "flgDel", "companyId", "class")
select "app", "username"||'a'||n, "password", "firstName", "lastName", 'A'||n||"email", NOW(), NOW(), "flgDel", "companyId"+m, "class" from (
select * from ra_user JOIN (
SELECT a.n, a.n / 3 m
from generate_series(3, 30000) as a(n)) B ON TRUE) as B;

insert into ra_forms_data ("dataType","data","wsResponse","createDate","updatedDate","companyId","name","status","accounts","alertMessage","emailAlert","emailAddress","triggeredCount","createdBy","updatedBy","subType","clientId")
select "dataType","data","wsResponse", NOW(),NOW(),"companyId"+m,"name"||'A'||n,"status","accounts","alertMessage","emailAlert","emailAddress","triggeredCount","createdBy","updatedBy","subType", "clientId"||'a'||n from (
select * from ra_forms_data JOIN (
SELECT a.n, a.n / 3 m
from generate_series(3, 30000) as a(n)) B ON TRUE) as C;
