import { Injectable } from "@nestjs/common";
import { FileDto } from "./dto/file.dto";

@Injectable()
export class FileService {

    async getFiles(userName: string, repoKey: string, path: string, recursive?: boolean): Promise<FileDto[]> {
        return (recursive) ? [{} as FileDto, {} as FileDto] : [{} as FileDto];
    }
}
