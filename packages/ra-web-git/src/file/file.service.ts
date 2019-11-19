import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "../config/config.service";

import * as _fs from "fs";
import * as _path from "path";

@Injectable()
export class FileService {

    constructor(private configService: ConfigService) {}

    /**
     * method returns file/dir names (recursively if needed)
     * 
     * @param userName 
     * @param repoKey 
     * @param relativeFilePath 
     * @param recursive 
     * 
     * @returns Promise<FileDto[]>
     * @throws InternalServerErrorException if file system operation failed
     */
    async getFiles(userName: string, repoKey: string, relativeFilePath: string, recursive?: boolean): Promise<FileDto[]> {
        const basePath = _path.resolve(this.configService.basePath);
        const path: string = _path.join(basePath, userName, repoKey, relativeFilePath);
        return (recursive) ? await this.getFilesByPathRecursively(path) : await this.getFilesByPath(path);
    }

    private async getFilesByPath(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];
        let dir: _fs.Dir;

        try {
            dir = await _fs.promises.opendir(path);
            
            for await (const dirent of dir) {
                const path: string = _path.join(dir.path, dirent.name);
                const directory: boolean = dirent.isDirectory()
                files.push({ name: dirent.name, path, directory });
            }
        } catch (error) {
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`, error);
        } finally {
            if (dir) {
                dir.close();
            }
        }
        return files;
    }

    private async getFilesByPathRecursively(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];
        let dir: _fs.Dir;

        try {
            dir = await _fs.promises.opendir(path);

            for await (const dirent of dir) {
                const path: string = _path.join(dir.path, dirent.name);
                if (dirent.isDirectory()) {
                    const innerFiles: FileDto[] = await this.getFilesByPathRecursively(path);
                    files.push({ name: dirent.name, path, directory: true, files: innerFiles });
                } else {
                    files.push({ name: dirent.name, path, directory: false });
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`, error);
        } finally {
            if (dir) {
                dir.close();
            }
        }
        return files;
    }
}
