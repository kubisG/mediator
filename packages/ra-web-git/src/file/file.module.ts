import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { CoreModule } from "@ra/web-core-be/dist/core.module";

@Module({
  imports: [CoreModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
