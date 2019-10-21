import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";

export function getLogger() {
    const logger = Substitute.for<Logger>();
    return logger;
}
