import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "../config/config.service";
import { FileContentDto } from "./dto/file-content.dto";

import * as _fs from "fs";
import * as _path from "path";
import * as _ from "lodash";

@Injectable()
export class FileService {

    constructor(private configService: ConfigService) {}

    /**
     * method returns file content
     *
     * @param userName
     * @param repoKey
     * @param relativeFilePath
     * @param encoding If encoding is not provided, it defaults to utf-8.
     *
     * @returns Promise<FileContentDto>
     * @throws InternalServerErrorException if file system operation failed
     */
    async getFile(userName: string, repoKey: string, relativeFilePath: string, encoding?: BufferEncoding): Promise<FileContentDto> {
        encoding = (encoding) ? encoding : "utf-8";
        const path: string = this.createPath(userName, repoKey, relativeFilePath);
        const type = this.getFileExtension(path);
        let content: string = null;

        try {
            content = await _fs.promises.readFile(path, { encoding });
        } catch (error) {
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
        return { type, content } as FileContentDto;
    }

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
        const path: string = this.createPath(userName, repoKey, relativeFilePath);
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

    private createPath(userName: string, repoKey: string, relativePath: string): string {
        const basePath = _path.resolve(this.configService.basePath);
        return _path.join(basePath, userName, repoKey, relativePath);
    }

    private getFileExtension(path: string): string {
        const dotExtension: string = _path.extname(path);
        return (dotExtension) ? dotExtension.split(".")[1] : null;
    }
}
