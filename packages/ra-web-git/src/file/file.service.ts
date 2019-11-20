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

    /**
     * get files
     *
     * Note: always try to avoid using 'fs.promises.opendir' cause it's hardly testable with mocks
     *
     * @param path
     */
    private async getFilesByPath(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];

        try {
            const dirents: _fs.Dirent[] = await _fs.promises.readdir(path, { withFileTypes: true });

            for (const dirent of dirents) {
                const newPath: string = _path.join(path, dirent.name);
                const directory: boolean = dirent.isDirectory();
                files.push({ name: dirent.name, path: newPath, directory });
            }
        } catch (error) {
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
        return files;
    }

    /**
     * get files recursively
     *
     * Note: always try to avoid using 'fs.promises.opendir' cause it's hardly testable with mocks
     *
     * @param path
     */
    private async getFilesByPathRecursively(path: string): Promise<FileDto[]> {
        const files: FileDto[] = [];

        try {
            const dirents: _fs.Dirent[] = await _fs.promises.readdir(path, { withFileTypes: true });

            for (const dirent of dirents) {
                const newPath: string = _path.join(path, dirent.name);
                if (dirent.isDirectory()) {
                    const innerFiles: FileDto[] = await this.getFilesByPathRecursively(newPath);
                    files.push({ name: dirent.name, path: newPath, directory: true, files: innerFiles });
                } else {
                    files.push({ name: dirent.name, path: newPath, directory: false });
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
        return files;
    }
}
