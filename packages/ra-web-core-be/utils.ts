import "reflect-metadata";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";

export const GATEWAY_METADATA = "__isGateway";
export const PORT_METADATA = "port";
export const GATEWAY_OPTIONS = "__gatewayOptions";

const BCRYPT_ROUNDS = 10;

export function getCompanyId(queueName: string, prefix: string) {
    return queueName.replace(prefix, "");
}

export function parseCompanyId(queue: string): any {
    return queue.split("_")[1];
}

export async function bcryptHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, BCRYPT_ROUNDS, (err, hash) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(hash);
        });
    });
}

export async function bcryptCompare(password: string, hash: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, res) {
            if (res) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export function md5(data: string) {
    return crypto.createHash("md5").update(data).digest("hex");
}

export function deepCloning(obj: any) {
    const newObject = new obj.constructor;
    for (const attribut in obj) {
        if (obj[attribut]) {
            newObject[attribut] = obj[attribut];
        }
    }
    return newObject;
}

export function logMessage(message: any) {
    return `${(message.RaID ? message.RaID : "")}, createDate: ${message.createDate}, msgType: ${message.msgType},`
        + `Symbol: ${message.Symbol}, SenderCompID: ${message.SenderCompID}, TargetCompID: ${message.TargetCompID}`;
}

export async function prepareFilter(filter: any, sortCol: string, sortDefault: string, sortDir: string, table: string) {
    if ((!sortCol) || (sortCol === "")) {
        sortCol = sortDefault;
    }

    if ((!sortDir) || (sortDir === "")) {
        sortDir = "ASC";
    }

    const orderBy = {};
    orderBy["\"" + sortCol + "\""] = sortDir;

    let whereCl = "";
    const data = {};

    // is filter set
    if ((filter) && (filter !== "")) {
        whereCl = "(";
        // create query
        await JSON.parse(filter).forEach((item, key, arr) => {
            if (item instanceof Array) {
                whereCl = whereCl + "(";
                item.forEach((subitem, subkey, subarr) => {
                    if (subitem instanceof Array) {
                        whereCl = whereCl + "(";
                        subitem.forEach((selitem, selkey, selarr) => {
                            if (Object.is(0, selkey)) {
                                whereCl = whereCl + "\"" + table + "\".\"" + selitem.replace("\"") + "\" ";
                            } else if (Object.is(selarr.length - 1, selkey)) {
                                whereCl = whereCl + " :A" + key + "A" + subkey + "A" + selkey;
                                data["A" + key + "A" + subkey + "A" + selkey] = selitem;
                            } else {
                                whereCl = whereCl + " " + selitem.replace("\"") + " ";
                            }
                        });
                        whereCl = whereCl + ")";
                    } else {
                        if (Object.is(0, subkey)) {
                            whereCl = whereCl + "\"" + table + "\".\"" + subitem.replace("\"") + "\" ";
                        } else if (Object.is(subarr.length - 1, subkey)) {
                            whereCl = whereCl + " :A" + key + "A" + subkey;
                            data["A" + key + "A" + subkey] = subitem;
                        } else {
                            whereCl = whereCl + " " + subitem.replace("\"") + " ";
                        }
                    }
                });
                whereCl = whereCl + ")";
            } else {
                if (Object.is(0, key)) {
                    whereCl = whereCl + "\"" + table + "\".\"" + item.replace("\"") + "\" ";
                } else if (Object.is(arr.length - 1, key)) {
                    whereCl = whereCl + " :A" + key;
                    data["A" + key] = item;
                } else {
                    whereCl = whereCl + " " + item.replace("\"") + " ";
                }
            }
        });
        whereCl = whereCl + ")";
    }
    return { whereCl: whereCl, data: data, orderBy: orderBy };
}
