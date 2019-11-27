import { Module } from "@nestjs/common";
import { GitService } from "./git.service";
import { GitController } from "./git.controller";
import { CoreModule } from "@ra/web-core-be/dist/core.module";

@Module({
  imports: [CoreModule],
  providers: [GitService],
  controllers: [GitController],
})
export class GitModule {}
