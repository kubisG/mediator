
import { TraderIoisService } from "./trader-iois.service";

export const traderIOIsProviders = [
    {
        provide: "traderIoisService",
        useFactory: async (
            ioisService: TraderIoisService,
        ): Promise<TraderIoisService> => {
            await ioisService.saveConsumedMessages();
            return ioisService;
        },
        inject: [
            TraderIoisService
        ],
    },
];
