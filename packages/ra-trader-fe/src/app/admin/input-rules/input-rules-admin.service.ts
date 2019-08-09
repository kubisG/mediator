import { Injectable } from "@angular/core";

/**
 * TODO : flags to enum
 */
@Injectable()
export class InputRulesAdminService {

    public getModelItems(rule: any, items: any[]) {
        const modelItems = [];
        const rootId = rule.rootId === null ? rule.relid : rule.rootId;
        for (let i = 0; i < items.length; i++) {
            if ((rootId === items[i].rootId) || (items[i].rootId === null && rootId === items[i].relid)) {
                modelItems.push(items[i]);
            }
        }
        return modelItems;
    }

    public createTree(data: any[], tree: { item: any, childs: any[], state: string }[], parentId) {
        for (let i = 0; i < data.length; i++) {
            if (parentId === data[i].parentId) {
                tree.push({ item: data[i], childs: this.createTree(data, [], data[i].relid), state: "S" });
            }
        }
        return tree;
    }

    public deleteItemFromTree(item, tree) {
        for (let i = 0; i < tree.length; i++) {
            if (
                tree[i].item.relid === item.item.relid
                && tree[i].item.parentId === item.item.parentId
            ) {
                if (item.state === "N" || item.state === "N1") {
                    tree.splice(i, 1);
                    return;
                } else {
                    if (tree[i].item.label === item.item.label && tree[i].item.value === item.item.value) {
                        tree.splice(i, 1);
                        return;
                    }
                }
            }
            if (tree[i].childs.length > 0) {
                this.deleteItemFromTree(item, tree[i].childs);
            }
        }
    }

}
