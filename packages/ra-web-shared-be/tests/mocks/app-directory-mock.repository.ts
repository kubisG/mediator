import { ObjectID, FindConditions, DeepPartial, SaveOptions } from "typeorm";
import { RaAppDirectory } from "../../src/app-directory/entities/ra-app-directory";
import { AppDirectorySearchDto } from "../../src/app-directory/dto/app-directory-search.dto";
import { RaAppDirectoryType } from "../../src/app-directory/entities/ra-app-directory-type";
import { AppDirectoryItemDto } from "../../src/app-directory/dto/app-directory-item.dto";

export class AppDirectoryMockRepository {

    public static appDirectoryItem: AppDirectoryItemDto = {
        appId: "Id",
        name: "Test",
        manifest: "Test",
        manifestType: "Test",
        version: "1.0.0",
        title: "Title",
        tooltip: "Tolltip",
        description: "Description",
        images: null,
        contactEmail: "test@test.cz",
        supportEmail: "test@test.cz",
        publisher: "Test",
        icons: null,
        customConfig: null,
        intents: null,
    };

    public appDirectory = {
        id: 1,
        intents: [],
        manifestDef: new RaAppDirectoryType(1),
        appId: "Id",
        name: "Test",
        manifest: "Test",
        manifestType: "Test",
        version: "1.0.0",
        title: "Title",
        tooltip: "Tolltip",
        description: "Description",
        images: null,
        contactEmail: "test@test.cz",
        supportEmail: "test@test.cz",
        publisher: "Test",
        icons: null,
        customConfig: null,
    };
    

    save<T extends import("typeorm").DeepPartial<any>>(entities: T[], options?: import("typeorm").SaveOptions): Promise<T> {
        return Promise.resolve(this.appDirectory as unknown as T);
    }

    remove(entities: any[], options?: import("typeorm").RemoveOptions): Promise<any[]> {
        return Promise.resolve([{ result: "OK" }]);
    }

    count(options?: import("typeorm").FindManyOptions<any>): Promise<number> {
        return Promise.resolve(1);
    }

    find(options?: import("typeorm").FindManyOptions<any>): Promise<any[]> {
        return Promise.resolve([this.appDirectory]);
    }

    findAndCount(options?: import("typeorm").FindManyOptions<any>): Promise<[any[], number]> {
        return Promise.resolve([[{ result: "OK" }], 1]);
    }

    async findOne(id?: string | number | Date | import("typeorm").ObjectID, options?: import("typeorm").FindOneOptions<any>): Promise<any> {
        return Promise.resolve(this.appDirectory);
    }

    delete(id: number): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    update({ criteria, partialEntity, options }: { criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<any>; partialEntity: DeepPartial<any>; options?: SaveOptions; }): Promise<any> {
        return Promise.resolve({ result: "OK" });
    }

    public async getApp(appId: string): Promise<RaAppDirectory> {
        return await this.findOne(appId, { relations: ["intents", "manifestDef"] });
    }

    public async searchApps(searchQuery: AppDirectorySearchDto): Promise<RaAppDirectory[]> {
        return await this.find({ where: searchQuery, relations: ["intents", "manifestDef"] });
    }

}
