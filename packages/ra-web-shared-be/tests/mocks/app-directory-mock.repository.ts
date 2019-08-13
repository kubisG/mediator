import { ObjectID, FindConditions, DeepPartial, SaveOptions } from "typeorm";
import { RaAppDirectory } from "../../src/app-directory/entities/ra-app-directory";
import { AppDirectorySearchDto } from "../../src/app-directory/dto/app-directory-search.dto";

export class AppDirectoryMockRepository {
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

    async findOne(id?: string | number | Date | import("typeorm").ObjectID, options?: import("typeorm").FindOneOptions<any>): Promise<any> {
        return Promise.resolve({ result: "OK", password: pass, email: "test@test.cz" });
    }

    delete(id: number): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    update({ criteria, partialEntity, options }: { criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<any>; partialEntity: DeepPartial<any>; options?: SaveOptions; }): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    public async getApp(appId: string): Promise<RaAppDirectory> {
        return await this.findOne( appId, { relations: ["intents", "manifestDef"] });
    }

    public async searchApps(searchQuery: AppDirectorySearchDto): Promise<RaAppDirectory[]> {
        return await this.find({ where: searchQuery, relations: ["intents", "manifestDef"] });
    }

}
