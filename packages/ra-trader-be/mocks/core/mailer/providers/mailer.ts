import Substitute from "@fluffy-spoon/substitute";
import { Mailer } from "@ra/web-core-be/dist/mailer/providers/mailer.interface";

export function getMailer() {
    const preferenceService = Substitute.for<Mailer>();
    return preferenceService;
}
