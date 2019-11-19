import { Injectable } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "src/config/config.service";

import * as fs from "fs";
import * as _path from "path";

@Injectable()
export class FileService {

    private basePath: string;

    constructor(configService: ConfigService) {
        this.basePath = _path.resolve(configService.basePath);
    }

    async getFiles(userName: string, repoKey: string, path: string, recursive?: boolean): Promise<FileDto[]> {
        await this.getFilesRecursively(this.basePath);
        return (recursive) ? [{} as FileDto, {} as FileDto] : [{} as FileDto];
    }

    async getFilesRecursively(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];
        const dir = await fs.promises.opendir(path);
        for await (const dirent of dir) {
            if (dirent.isDirectory) {
            }
        }
        return null;
    }
}
