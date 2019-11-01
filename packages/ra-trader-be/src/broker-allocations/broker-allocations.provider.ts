import { BrokerAllocationsService } from "./broker-allocations.service";

export const brokerAllocationsProviders = [
    {
        provide: "brokerAllocationsService",
        useFactory: async (
            allocationService: BrokerAllocationsService,
        ): Promise<BrokerAllocationsService> => {
            await allocationService.saveConsumedMessages();
            return allocationService;
        },
        inject: [
            BrokerAllocationsService,
        ],
    },
];
