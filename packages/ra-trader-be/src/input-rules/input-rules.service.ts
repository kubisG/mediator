import { Injectable, Inject } from "@nestjs/common";
import { Connection } from "typeorm";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { HttpCacheService } from "@ra/web-core-be/dist/http-cache.service";
import { InputRulesRepository } from "../dao/repositories/input-rules.repository";
import { RaInputRules } from "../entity/ra-input-rules";
import { UserData } from "../users/user-data.interface";
import { InputRelationsRepository } from "../dao/repositories/input-relations.repository";

@Injectable()
export class InputRulesService {

    constructor(
        private authService: AuthService,
        private httpCacheService: HttpCacheService,
        @Inject("inputRulesRepository") private raInputRulesToken: InputRulesRepository,
        @Inject("inputRelationsRepository") private raInputRelationsToken: InputRelationsRepository,
    ) { }

    public async getInputs(token: any, isAdmin = false) {
        const userData = await this.authService.getUserData<UserData>(token);
        if (!isAdmin) {
            return await this.raInputRulesToken.getInputRules(userData.compId);
            // find({ where: [{ companyId: userData.compId }, { companyId: 0 }] })
        } else {
            return await this.raInputRulesToken.getInputRules();
        }
    }

    async findByType(token: any, type: any): Promise<RaInputRules[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raInputRulesToken.getInputRules(userData.compId, type);
        // find({ where: [{ companyId: userData.compId, label: type }, { companyId: 0, label: type }] });
    }

    private async saveInputTree(tree, compId, rootId = null, parentId = null) {
        console.log("tree", tree );
        console.log("compId", compId );
        console.log("rootId", rootId );
        console.log("parentId", parentId );
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].item.id === -1) {
                delete tree[i].item.id;
            }
            tree[i].item.rootId = rootId;
            tree[i].item.parentId = parentId;
            tree[i].item.companyId = compId;
            const item = await this.raInputRulesToken.save(tree[i].item);
            tree[i].item.childId = item.id;
            const rel = await this.raInputRelationsToken.save(tree[i].item);
            if (tree[i].childs.length > 0) {
                await this.saveInputTree(tree[i].childs, compId, (rootId === null ? rel.relid : rootId), rel.relid);
            }
        }
    }

    public async saveInputs(token: any, data: { companyId: number, inputs: any[], del: any[] }) {
        if (data.del.length > 0) {
            console.log("del", data.del);
            for (let i = 0; i < data.del.length; i++) {
                await this.raInputRelationsToken.delete(data.del[i]);
                // test if still exists in relations...
                const exists = await this.raInputRelationsToken.find({ childId: data.del[i].id });

                if ((!exists) || (exists.length === 0)) {
                    await this.raInputRulesToken.delete(data.del[i]);
                }
            }
        }
        this.httpCacheService.setClearCache();
        await this.saveInputTree(data.inputs, data.companyId ? data.companyId : 0);
        return await this.getInputs(token, true);
    }

    private transformRules(result: any[], level = 1, parentId = null) {
        const tree = {};
        for (let i = 0; i < result.length; i++) {
            if (result[i].level === level && result[i].parentId === parentId) {
                if (!tree[result[i].label]) {
                    tree[result[i].label] = [];
                }
                tree[result[i].label].push({ ...result[i], childs: this.transformRules(result, level + 1, result[i].relid) });
            }
        }
        return tree;
    }

    public async getRules(token: any, label: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        const result = await this.raInputRulesToken.getRules(userData.compId);
        return this.transformRules(result);
    }

}
