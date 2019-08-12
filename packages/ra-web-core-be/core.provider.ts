import * as fastRandom from "fast-random";

export const fastRandomFactory = {
    provide: "fastRandom",
    useFactory: async (): Promise<fastRandom> => {
        const fastRnd = fastRandom.default ? fastRandom.default(new Date().getTime()) : fastRandom(new Date().getTime());
        return {
            nextInt: () => {
                return Number(`${new Date().toISOString().substr(0, 10).replace(/-/g, "")}${fastRnd.nextInt()}`);
            },
        };
    },
    inject: [],
};
