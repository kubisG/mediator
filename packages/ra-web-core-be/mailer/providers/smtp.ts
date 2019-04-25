import { Logger } from "../../logger/providers/logger";
import { Mailer } from "./mailer.interface";
import { EnvironmentService } from "ra-web-env-be/environment.service";

import * as Nodemailer from "nodemailer";
// import { closeHandlers } from "../../../main";

export class Smtp implements Mailer {

    private transporter;

    constructor(
        private logger: Logger,
        private env: EnvironmentService,
    ) {
        // closeHandlers.push(async () => {
        //     this.logger.warn(`Closing Smtp`);
        //     await this.close();
        // });
    }

    public async connect() {

        try {
            let options;
            if (this.env.mailer.opt.user) {
                options = {
                    host: this.env.mailer.opt.host,
                    port: this.env.mailer.opt.port,
                    secure: (this.env.mailer.opt.secure === "true"),
                    auth: {
                        user: this.env.mailer.opt.user, // user
                        pass: this.env.mailer.opt.password // password
                    }
                };
            } else {
                options = {
                    host: this.env.mailer.opt.host,
                    port: this.env.mailer.opt.port,
                    secure: (this.env.mailer.opt.secure === "true"),
                    authMethod: "PLAIN",
                };
            }

            this.transporter = Nodemailer.createTransport(options);
        } catch (ex) {
            this.logger.error(ex);
            this.close();
        }
    }

    public close() {
        if (this.transporter) {
            this.transporter.close();
        }
    }

    public async send(from: string, to: string, subject: string, text: string) {
        const email: Nodemailer.SendMailOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text
        };
        return await this.transporter.sendMail(email);
    }

}
