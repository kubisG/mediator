import { Injectable, InternalServerErrorException, Logger, Inject } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";
import { ConfigService } from "../config/config.service";
import { FileContentDto } from "./dto/file-content.dto";
import { getFileExtension, createPath } from "../utils";

import * as _fs from "fs";
import * as _path from "path";
import * as _ from "lodash";

const MAX_CALLS = 999;

@Injectable()
export class FileService {

    constructor(
        private configService: ConfigService,
        @Inject("logger") private logger: Logger,
    ) { }

    /**
     * get files recursively
     *
     * Note: always try to avoid using 'fs.promises.opendir' cause it's hardly testable with mocks
     *
     * @param path
     * @param calls
     * @param searchText
     *
     * @returns  Promise<FileDto[]>
     */
    private async getFilesByPathRecursively(path: string, calls: number, searchText?: string): Promise<FileDto[]> {
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
                } else if (!searchText || (searchText && dirent.name.includes(searchText))) {
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
    private async getFilesByPath(path: string, searchText?: string): Promise<FileDto[]> {
        const files: FileDto[] = [];

        try {
            const dirents: _fs.Dirent[] = await _fs.promises.readdir(path, { withFileTypes: true });

            for (const dirent of dirents) {
                const newPath: string = _path.join(path, dirent.name);
                const directory: boolean = dirent.isDirectory();
                if (!searchText || (searchText && dirent.name.includes(searchText))) {
                    files.push({ name: dirent.name, path: newPath, directory });
                }
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
        const path: string = createPath(this.configService.basePath, userName, repoKey, relativeFilePath);
        const type = getFileExtension(path);
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
    async getFiles(userName: string, repoKey: string, relativeFilePath: string, recursive?: boolean, searchText?: string): Promise<FileDto[]> {
        const calls = 0;
        const path: string = createPath(this.configService.basePath, userName, repoKey, relativeFilePath);
        return (recursive) ? await this.getFilesByPathRecursively(path, calls, searchText) : await this.getFilesByPath(path, searchText);
    }

    /**
     * method create/update file content
     *
     * @param userName
     * @param repoKey
     * @param relativeFilePath
     * @param encoding
     * @param fileContent file content so save/update
     */
    async createOrUpdateFile(
        userName: string,
        repoKey: string,
        relativeFilePath: string,
        fileContent: FileContentDto,
        encoding: BufferEncoding = "utf-8",
    ): Promise<void> {
        const path: string = createPath(this.configService.basePath, userName, repoKey, relativeFilePath);

        try {
            await _fs.promises.writeFile(path, fileContent.content, encoding);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Fail during processing file: ${error.path}`);
        }
    }

    /**
     * method delete file
     *
     * @param userName
     * @param repoKey
     * @param relativeFilePath
     *
     * @returns Promise<void>
     */
    async deleteFile(
        userName: string,
        repoKey: string,
        relativeFilePath: string,
    ): Promise<void> {
        const path: string = createPath(this.configService.basePath, userName, repoKey, relativeFilePath);

        try {
            await _fs.promises.unlink(path);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Delete file failed.`, error.message);
        }
    }
}
