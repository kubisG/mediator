import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { FileDto } from "./dto/file.dto";
import { FileService } from "./file.service";
import { FileContentDto } from "./dto/file-content.dto";

@Controller("files")
@ApiUseTags("files")
export class FileController {

    constructor(private fileService: FileService) { }

    @Get("/:userName/:repoKey/:path/content")
    async getFile(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Param("path") path: string,
    ): Promise<FileContentDto> {
        return await this.fileService.getFile(userName, repoKey, path);
    }

    @Get("/:userName/:repoKey/:path")
    async getFiles(
        @Param("userName") userName: string,
        @Param("repoKey") repoKey: string,
        @Param("path") path: string,
        @Query("recursive") recursive: string,
    ): Promise<FileDto[]> {
        return await this.fileService.getFiles(userName, repoKey, path, (recursive === "true"));
    }
}
