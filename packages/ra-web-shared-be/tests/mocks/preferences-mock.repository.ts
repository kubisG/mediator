import { SaveOptions, DeepPartial } from "typeorm";
import { RaPreference } from "@ra/web-core-be/db/entity/ra-preference";

export class PreferencesMockRepository {
    save<T extends DeepPartial<RaPreference>>(entity: T, options?: SaveOptions): Promise<T> {
        return Promise.resolve({ value: "{ \"result\":\"OK\" }"  } as unknown as T);
    }

    remove(entities: any[], options?: import("typeorm").RemoveOptions): Promise<any[]> {
        return Promise.resolve([{ result: "OK" }]);
    }

    count(options?: import("typeorm").FindManyOptions<any>): Promise<number> {
        return Promise.resolve(1);
    }

    find(options?: import("typeorm").FindManyOptions<any>): Promise<any[]> {
        return Promise.resolve([{ value: "{ \"result\":\"OK\" }"  }]);
    }

    findAndCount(options?: import("typeorm").FindManyOptions<any>): Promise<[any[], number]> {
        return Promise.resolve([[{ value: "{ \"result\":\"OK\" }" }], 1]);
    }

    findOne(id?: string | number | Date | import("typeorm").ObjectID, options?: import("typeorm").FindOneOptions<any>): Promise<any> {
        return Promise.resolve({ value: "{ \"result\":\"OK\" }"  });
    }

    delete(id: number): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    createQueryBuilder = jest.fn(() => ({
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockReturnValueOnce([[{ value: "{ \"result\":\"OK\" }" }], 1 ]),
        getOne: jest.fn().mockReturnValueOnce({ value: "{ \"result\":\"OK\" }" }),
        getMany: jest.fn().mockReturnValueOnce([{ value: "{ \"result\":\"OK\" }", userId:"1", companyId:"1" }]),
    }));
  
    
}
