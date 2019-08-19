import { EntityRepository, Repository, In, Like } from "typeorm";
import { RaPreference } from "../../db/entity/ra-preference";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@EntityRepository(RaPreference)
export class PreferenceRepository extends Repository<RaPreference> {

    constructor(private env: EnvironmentService) {
        super();
    }

    public async getLayoutConfig(userId: number, companyId: number, name: string) {
        const config = await this.findOne({
            userId,
            companyId,
            name: `layout_${name}`,
            version: this.env.appVersion,
        });
        return config ? JSON.parse(config.value) : undefined;
    }

    public async setLayoutConfig(userId: number, companyId: number, config: any, name: string) {
        return await this.save({
            name: `layout_${name}`,
            value: JSON.stringify(config),
            userId,
            companyId,
            version: this.env.appVersion,
        });
    }

    public async getLayoutsName(userId: number, companyId: number) {
        const configs: RaPreference[] = await this.find({
            where: {
                userId: In([userId, 0]),
                companyId: In([companyId, 0]),
                name: Like("layout_%"),
                version: this.env.appVersion,
            }, order: { userId: "ASC", name: "ASC" }
        });
        const configNames: string[] = [];
        for (let i = 0; i < configs.length; i++) {
            if (configs[i].name.indexOf(`layout_`) > -1) {
                const name = configs[i].name.split("_");
                configNames.push(name[1]);
            }
        }
        return configNames;
    }

    public async deleteLayoutConfig(userId: number, companyId: number, name: string) {
        return await this.delete({
            name: `layout_${name}`, userId, companyId, version: this.env.appVersion,
        });
    }

}
