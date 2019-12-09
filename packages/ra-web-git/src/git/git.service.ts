import { Injectable, Inject, Logger, InternalServerErrorException } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { ConfigService } from "../config/config.service";
import { createPath } from "../utils";
import { PullSummaryDto } from "./dto/pull-summary.dto";

import * as simplegit from "simple-git/promise";
import * as _ from "lodash";
import { RepoStatusDto } from "./dto/repository-status.dto";

@Injectable()
export class GitService {

    constructor(
        private configService: ConfigService,
        @Inject("logger") private logger: Logger,
    ) { }

    // TODO: don't remove, will be used when max number of commits is specified
    private async getNumberOfCommits(userName: string, repoKey: string): Promise<number> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const commands = ["rev-list", "--all", "--count"];
        const git = simplegit(path).silent(true);
        const count = await git.raw(commands);
        return Number(count);
    }

    async clone(userName: string, repoKey: string, cloneRequest: CloneRequestDto): Promise<string> {
        const git = simplegit().silent(true);
        const encodedPassword: string = encodeURIComponent(cloneRequest.password); // encode chars like ?,=,/,&,:
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const remote: string = `https://${cloneRequest.userName}:${encodedPassword}@${cloneRequest.repoPath}`;
        try {
            return await git.clone(remote, path);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Cloning repository failed.", error.message);
        }
    }

    async pull(userName: string, repoKey: string): Promise<PullSummaryDto> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path).silent(true);
        let summary: PullSummaryDto = null;
        try {
            summary = (await git.pull()).summary;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Pulling changes failed.", error.message);
        }
        return summary;
    }

    async checkout(userName: string, repoKey: string, branch: string): Promise<void> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path).silent(true);
        try {
            await git.checkout(branch);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Checkout branch failed.", error.message);
        }
    }

    async commit(userName: string, repoKey: string, message: string): Promise<void> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path).silent(true);
        try {
            const status = await git.status();
            await git.add([...status.not_added, ...status.deleted, ...status.modified]);
            await git.commit(message);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Commit changes failed.", error.message);
        }
    }

    async push(userName: string, repoKey: string): Promise<void> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path).silent(true);
        try {
            await git.push();
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Push changes failed.", error.message);
        }
    }

    async getStatus(userName: string, repoKey: string): Promise<RepoStatusDto> {
        const path: string = createPath(this.configService.basePath, userName, repoKey);
        const git = simplegit(path).silent(true);
        let status: RepoStatusDto = null;
        try {
            const result = await git.status();
            status = { unstaged: result.not_added, modified: result.modified,
                deleted: result.deleted, conflicted: result.conflicted } as RepoStatusDto;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Get repository status failed.", error.message);
        }
        return status;
    }
}
