import { BrokerIoisService } from "./broker-iois.service";

export const brokerIOIsProviders = [
    {
        provide: "brokerIoisService",
        useFactory: async (
            ioisService: BrokerIoisService,
        ): Promise<BrokerIoisService> => {
            await ioisService.saveConsumedMessages();
            return ioisService;
        },
        inject: [
            BrokerIoisService,
        ],
    },
];
