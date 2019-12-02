import { Injectable, Inject, Logger, InternalServerErrorException } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { ConfigService } from "../config/config.service";
import { createPath } from "../utils";
import { PullSummaryDto } from "./dto/pull-summary.dto";

import * as simplegit from "simple-git/promise";

@Injectable()
export class GitService {

    constructor(
        private configService: ConfigService,
        @Inject("logger") private logger: Logger,
    ) { }

    async clone(userName: string, repoKey: string, cloneRequest: CloneRequestDto): Promise<string> {
        const git = simplegit();
        const encodedPassword: string = encodeURIComponent(cloneRequest.password); // encode chars like ?,=,/,&,:
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const remote: string = `https://${cloneRequest.userName}:${encodedPassword}@${cloneRequest.repoPath}`;
        try {
            return await git.silent(true).clone(remote, path);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Cloning repository failed.", error.message);
        }
    }

    async pull(userName: string, repoKey: string): Promise<PullSummaryDto> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path);
        let summary: PullSummaryDto = null;
        try {
            summary = (await git.silent(true).pull()).summary;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Pulling changes failed.", error.message);
        }
        return summary;
    }
}
