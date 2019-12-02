import { Controller, Post, Param, Body, Put } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { GitService } from "./git.service";

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

    @Put("/:userName/:repoKey")
    async pull(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
    ): Promise<void> {
        await this.gitService.pull(userName, repoKey);
    }
}
