import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { MessagesRouter } from "./routing/messages-router";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { PreferenceRepository } from "../dao/repositories/preference.repository";
import { RaPreference } from "../entity/ra-preference";
import { CompanyRepository } from "../dao/repositories/company.repository";

export const messageFilterFactory = {
    provide: "messageFilter",
    useFactory: async (raPreference: PreferenceRepository): Promise<MessageValidatorService> => {
        const validator = new MessageValidatorService();
        const messageFilter: RaPreference = await raPreference.findOne({
            name: "messageFilters",
            userId: 0,
            companyId: 0,
        });
        if (messageFilter) {
            validator.setFilter(JSON.parse(messageFilter.value));
        }
        return validator;
    },
    inject: ["preferenceRepository"],
};

export const messagesRouting = [
    {
        provide: "brokerRouting",
        useFactory: async (
            queue: Queue,
            logger: Logger,
            fastRandom: any,
            env: EnvironmentService,
            companyRepository: CompanyRepository,
        ): Promise<MessagesRouter> => {
            const router: MessagesRouter = new MessagesRouter(
                queue,
                logger,
                fastRandom,
                env.queue.prefixBroker,
                env.queue.opt.broker.qBroker,
                Apps.broker,
            );

            console.log("REPO", companyRepository);

            const companies = await companyRepository.find();
            for (let i = 0; i < companies.length; i++) {
                logger.info(`MESSAGE PROVIDER: CREATING BROKER QUEUE: ${env.queue.prefixBroker}${companies[i].id}`);
                await router.initConsumeMessages(null, `${env.queue.prefixBroker}${companies[i].id}`);
            }

            return router;
        },
        inject: ["queueBroker", "logger", "fastRandom", EnvironmentService, "companyRepository"]
    },
    {
        provide: "traderRouting",
        useFactory: async (
            queue: Queue,
            logger: Logger,
            fastRandom: any,
            env: EnvironmentService,
            companyRepository: CompanyRepository,
        ): Promise<MessagesRouter> => {
            const router: MessagesRouter = new MessagesRouter(
                queue,
                logger,
                fastRandom,
                env.queue.prefixTrader,
                env.queue.opt.trader.qTrader,
                Apps.trader,
            );
            const companies = await companyRepository.find();
            for (let i = 0; i < companies.length; i++) {
                logger.info(`MESSAGE PROVIDER: CREATING TRADER QUEUE: ${env.queue.prefixTrader}${companies[i].id}`);
                await router.initConsumeMessages(null, `${env.queue.prefixTrader}${companies[i].id}`);
            }

            return router;
        },
        inject: ["queueTrader", "logger", "fastRandom", EnvironmentService, "companyRepository"]
    }
];
