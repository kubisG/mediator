export abstract class AEntity {

    public static create<T>(c: new () => T, data: any): T {
        const obj: T = new c();
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                obj[prop] = data[prop];
            }
        }
        return obj;
    }

    public fill(data: any) {
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                this[prop] = data[prop];
            }
        }
    }
}
