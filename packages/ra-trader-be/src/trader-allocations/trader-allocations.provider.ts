import { TraderAllocationsService } from "./trader-allocations.service";

export const traderAllocationsProviders = [
    {
        provide: "traderAllocationsService",
        useFactory: async (
            allocationService: TraderAllocationsService,
        ): Promise<TraderAllocationsService> => {
            await allocationService.saveConsumedMessages();
            return allocationService;
        },
        inject: [
            TraderAllocationsService,
        ],
    },
];
