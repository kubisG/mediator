import CustomStore from "devextreme/data/custom_store";

export class OrderStore extends CustomStore {

    constructor() {
        super({
            load: (loadOptions: any) => {
                return Promise.resolve([]);
            }
        });
    }

}
