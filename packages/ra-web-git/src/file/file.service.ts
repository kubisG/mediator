import { Injectable, InternalServerErrorException, Logger, Inject } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "../config/config.service";
import { FileContentDto } from "./dto/file-content.dto";

import * as _fs from "fs";
import * as _path from "path";
import * as _ from "lodash";

const MAX_CALLS = 99999;

@Injectable()
export class FileService {

    constructor(
        private configService: ConfigService,
        @Inject("logger") private logger: Logger,
    ) { }

    private createPath(userName: string, repoKey: string, relativePath: string): string {
        const basePath = _path.resolve(this.configService.basePath);
        return _path.join(basePath, userName, repoKey, relativePath);
    }

    private getFileExtension(path: string): string {
        const dotExtension: string = _path.extname(path);
        return (dotExtension) ? dotExtension.split(".")[1] : null;
    }

    /**
     * get files recursively ()
     *
     * Note: always try to avoid using 'fs.promises.opendir' cause it's hardly testable with mocks
     *
     * @param path
     * @param calls
     */
    private async getFilesByPathRecursively(path: string, calls: number): Promise<FileDto[]> {
        const files: FileDto[] = [];
        calls++;

        try {
            if (calls > MAX_CALLS) {
                throw new Error(`Exceeded max number of function calls. Max number is: ${MAX_CALLS}`);
            }
            const dirents: _fs.Dirent[] = await _fs.promises.readdir(path, { withFileTypes: true });

            for (const dirent of dirents) {
                const newPath: string = _path.join(path, dirent.name);
                if (dirent.isDirectory()) {
                    const innerFiles: FileDto[] = await this.getFilesByPathRecursively(newPath, calls);
                    files.push({ name: dirent.name, path: newPath, directory: true, files: innerFiles });
                } else {
                    files.push({ name: dirent.name, path: newPath, directory: false });
                }
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
        return files;
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
            this.logger.error(error);
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
        return files;
    }

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
    async getFile(userName: string, repoKey: string, relativeFilePath: string, encoding: BufferEncoding = "utf-8"): Promise<FileContentDto> {
        const path: string = this.createPath(userName, repoKey, relativeFilePath);
        const type = this.getFileExtension(path);
        let content: string = null;

        try {
            content = await _fs.promises.readFile(path, { encoding });
        } catch (error) {
            this.logger.error(error);
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
        const calls = 0;
        return (recursive) ? await this.getFilesByPathRecursively(path, calls) : await this.getFilesByPath(path);
    }

    /**
     * method create/update file content
     *
     * @param userName
     * @param repoKey
     * @param relativeFilePath
     * @param encoding
     * @param fileContent
     */
    async createOrUpdateFile(
        userName: string,
        repoKey: string,
        relativeFilePath: string,
        fileContent: FileContentDto,
        encoding: BufferEncoding = "utf-8",
    ): Promise<void> {
        const path: string = this.createPath(userName, repoKey, relativeFilePath);

        try {
            await _fs.promises.writeFile(path, fileContent.content, encoding);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
    }
}
