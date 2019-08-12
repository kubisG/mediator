import { ObjectID, FindConditions, DeepPartial, SaveOptions } from "typeorm";

export class UsersMockRepository {
    save<T extends import("typeorm").DeepPartial<any>>(entities: T[], options?: import("typeorm").SaveOptions): Promise<T[]> {
        return Promise.resolve([{ result: "OK" } as unknown as T]);
    }

    remove(entities: any[], options?: import("typeorm").RemoveOptions): Promise<any[]> {
        return Promise.resolve([{ result: "OK" }]);
    }

    count(options?: import("typeorm").FindManyOptions<any>): Promise<number> {
        return Promise.resolve(1);
    }

    find(options?: import("typeorm").FindManyOptions<any>): Promise<any[]> {
        return Promise.resolve([{ result: "OK" }]);
    }

    findAndCount(options?: import("typeorm").FindManyOptions<any>): Promise<[any[], number]> {
        return Promise.resolve([[{ result: "OK" }], 1]);
    }

    findOne(id?: string | number | Date | import("typeorm").ObjectID, options?: import("typeorm").FindOneOptions<any>): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    delete(id: number): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    getData(dateFrom, dateTo, compId, typ): Promise<any> {
        return Promise.resolve([{ result: "OK" }]);
    }
    update({ criteria, partialEntity, options }: { criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<any>; partialEntity: DeepPartial<any>; options?: SaveOptions; }): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }
}
