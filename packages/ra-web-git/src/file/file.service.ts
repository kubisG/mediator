import { Injectable } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "src/config/config.service";

import * as _fs from "fs";
import * as _path from "path";

@Injectable()
export class FileService {

    private basePath: string;

    constructor(configService: ConfigService) {
        this.basePath = _path.resolve(configService.basePath);
    }

    async getFiles(userName: string, repoKey: string, relativeFilePath: string, recursive?: boolean): Promise<FileDto[]> {
        const path: string = _path.join(this.basePath, userName, repoKey, relativeFilePath);
        return (recursive) ? await this.getFilesByPathRecursively(path) : await this.getFilesByPath(path);
    }

    async getFilesByPath(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];
        const dir = await _fs.promises.opendir(path);

        for await (const dirent of dir) {
            const path: string = _path.join(dir.path, dirent.name);
            const directory: boolean = dirent.isDirectory()
            files.push({ name: dirent.name, path, directory });
        }
        return files;
    }

    async getFilesByPathRecursively(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];
        const dir = await _fs.promises.opendir(path);

        for await (const dirent of dir) {
            const path: string = _path.join(dir.path, dirent.name);
            if (dirent.isDirectory()) {
                const innerFiles: FileDto[] = await this.getFilesByPathRecursively(path);
                files.push({ name: dirent.name, path, directory: true, files: innerFiles });
            } else {
                files.push({ name: dirent.name, path, directory: false });
            }
        }
        return files;
    }
}
