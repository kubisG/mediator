import { EntityRepository, Repository, Like, In } from "typeorm";
import { RaPreference } from "../../entity/ra-preference";

@EntityRepository(RaPreference)
export class PreferenceRepository extends Repository<RaPreference> {

    public async getUsersLayoutPrefs() {
        return await this.createQueryBuilder("pref")
            .where("pref.userId > 0 AND pref.companyId > 0 AND pref.name = 'layout.prefs'")
            .getMany();
    }

    public async getLayoutConfig(userId: number, companyId: number, name: string) {
        let config = await this.findOne({
            userId,
            companyId,
            name: `layout_${name}`,
        });

        if ((!config) || (config === null)) {
            config = await this.findOne({
                userId: 0,
                companyId: 0,
                name: `layout_${name}`,
            });
        }

        return config ? JSON.parse(config.value) : undefined;
    }

    public async setLayoutConfig(userId: number, companyId: number, config: any, name: string) {
        return await this.save({
            name: `layout_${name}`,
            value: JSON.stringify(config),
            userId,
            companyId,
        });
    }

    public async getLayoutsName(userId: number, companyId: number) {
        const configs: RaPreference[] = await this.find( {where: {
            userId: In([userId , 0] ),
            companyId: In([companyId, 0] ),
            name: Like("layout_%"),
        }, order: { userId: "ASC", name: "ASC" }});
        const configNames: string[] = [];
        for (const config of configs) {
            const name = config.name.split("_");
            configNames.push(name[1]);
        }
        return configNames;
    }

    public async deleteLayoutConfig(userId: number, companyId: number, name: string) {
        return await this.delete({ name: `layout_${name}`, userId, companyId });
    }

}
