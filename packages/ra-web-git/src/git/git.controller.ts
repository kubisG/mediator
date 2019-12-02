import { Controller, Post, Param, Body, Put } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { GitService } from "./git.service";
import { PullSummaryDto } from "./dto/pull-summary.dto";

@Controller("git")
export class GitController {

    constructor(private gitService: GitService) { }

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

    @Put("/:userName/:repoKey/:branch")
    async checkout(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Param("branch") branch: string,
    ): Promise<void> {
        await this.gitService.checkout(userName, repoKey, branch);
    }

    @Put("/:userName/:repoKey/commit")
    async commit(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Body("message") message: string,
    ): Promise<void> {
        await this.gitService.commit(userName, repoKey, message);
    }
}
