import { Controller, Post, Param, Body, Put, Get } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { GitService } from "./git.service";
import { PullSummaryDto } from "./dto/pull-summary.dto";
import { RepoStatusDto } from "./dto/repository-status.dto";

@Controller("git")
export class GitController {

    constructor(private gitService: GitService) { }

    @Get("/:userName/:repoKey")
    async getStatus(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
    ): Promise<RepoStatusDto> {
        return await this.gitService.getStatus(userName, repoKey);
    }

    @Post("/:userName/:repoKey")
    async clone(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Body() body: CloneRequestDto,
    ): Promise<string> {
        return await this.gitService.clone(userName, repoKey, body);
    }

    @Put("/:userName/:repoKey/pull")
    async pull(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
    ): Promise<PullSummaryDto> {
        return await this.gitService.pull(userName, repoKey);
    }

    @Put("/:userName/:repoKey/commit")
    async commit(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Body("message") message: string,
    ): Promise<void> {
        await this.gitService.commit(userName, repoKey, message);
    }

    @Put("/:userName/:repoKey/push")
    async push(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
    ): Promise<void> {
        await this.gitService.push(userName, repoKey);
    }

    @Put("/:userName/:repoKey/:branch")
    async checkout(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Param("branch") branch: string,
    ): Promise<void> {
        await this.gitService.checkout(userName, repoKey, branch);
    }
}
