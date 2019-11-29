import { Injectable, Inject, Logger, InternalServerErrorException } from "@nestjs/common";
import { CloneRequestDto } from "./dto/clone-request.dto";
import { ConfigService } from "../config/config.service";
import { createPath, getDirectoryName } from "../utils";

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
        const directory: string = (cloneRequest.directory) ? cloneRequest.directory : getDirectoryName(cloneRequest.repoPath);
        const path: string = createPath(this.configService.basePath, userName, repoKey, directory);
        const remote: string = `https://${cloneRequest.userName}:${encodedPassword}@${cloneRequest.repoPath}`;
        try {
            return await git.silent(true).clone(remote, path);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException("Cloning repository failed.", error.message);
        }
    }
}
