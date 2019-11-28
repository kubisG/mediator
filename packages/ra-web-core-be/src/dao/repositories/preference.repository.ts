import { EntityRepository, Repository, In, Like, MoreThan, Raw, IsNull } from "typeorm";
import { RaPreference } from "../../db/entity/ra-preference";

@EntityRepository(RaPreference)
export class PreferenceRepository extends Repository<RaPreference> {

    constructor() {
        super();
    }

    public async getLayoutConfig(userId: number, companyId: number, name: string, version: string) {
        let config = await this.findOne({
            where: {
                userId: Raw((alias) => `(${alias} IN (0, ${userId}) OR "flag" = 'Public')`),
                companyId,
                name: `layout_${name}`,
                version: version ? version : "1.0.0",
            },
        });

        if ((!config) || (config === null)) {
            config = await this.findOne({
                flag: "Public",
                userId: MoreThan(0),
                companyId,
                name: `layout_${name}`,
                version: version ? version : "1.0.0",
            });

            if ((!config) || (config === null)) {
                config = await this.findOne({
                    flag: "Public",
                    userId: 0,
                    companyId: 0,
                    name: `layout_${name}`,
                    version: version ? version : "1.0.0",
                });
            }
        }

        return config ? JSON.parse(config.value) : undefined;
    }

    public async setLayoutConfig(userId: number, companyId: number, config: any, name: string, version: string) {
        return await this.save({
            name: `layout_${name}`,
            value: JSON.stringify(config),
            userId,
            companyId,
            version: version ? version : "1.0.0",
        });
    }

    public async getLayoutsName(userId: number, companyId: number, version: string) {
        const configs: RaPreference[] = await this.find({
            where: {
                userId: Raw((alias) => `(${alias} IN (0, ${userId}) OR "flag" = 'Public')`),
                companyId: In([companyId, 0]),
                name: Like("layout_%"),
                version: version ? version : "1.0.0",
            }, order: { userId: "ASC", name: "ASC" },
        });

        const layouts: any[] = [];
        for (const config of configs) {
            if (config.name.indexOf(`layout_`) > -1) {
                const name = config.name.split(/_(.+)/);
                layouts.push({ name: name[1], flag: config.flag, userId: config.userId });
            }
        }
        return layouts;
    }

    public async getHitlistsName(hitlist: string, userId: number, companyId: number, version: string) {
        const configs: RaPreference[] = await this.find({
            where: {
                userId: Raw((alias) => `(${alias} IN (0, ${userId}) OR "flag" = 'Public')`),
                companyId: In([companyId, 0]),
                name: Like("hitlist_" + hitlist + "~%"),
                version: version ? version : "1.0.0",
            }, order: { userId: "ASC", name: "ASC" },
        });

        const hitlists: any[] = [];
        for (const config of configs) {
            if (config.name.indexOf(`hitlist_${hitlist}~`) > -1) {
                const name = config.name.split(/~(.+)/);
                hitlists.push({ name: name[1], flag: config.flag, userId: config.userId });
            }
        }
        return hitlists;
    }

    public async deleteLayoutConfig(userId: number, companyId: number, name: string, version: string) {
        // if we have it like default, we need to remove it....
        const key = name.split(/\-(.+)/)[0];
        const subName = name.split(/\-(.+)/)[1];

        await this.delete({ name: `default_layout_${key}`, value: subName, userId, companyId, version: version ? version : "1.0.0" });
        return await this.delete({
            name: `layout_${name}`, userId, companyId, version: version ? version : "1.0.0",
        });
    }

    public async setPublicPrivate(userId: number, companyId: number, state: any, name: string, version: string) {
        return await this.update({
            name,
            version: version ? version : "1.0.0",
            userId,
            companyId,
        }, {
                flag: state,
            });
    }

    public async getPublicPrivate(userId: number, companyId: number, name: string, version: string) {
        return await this.findOne({
            where: {
                userId: Raw((alias) => `(${alias} IN (0, ${userId}) OR "flag" = 'Public')`),
                companyId,
                name,
                version: version ? version : "1.0.0",
            },
        });
    }
}
