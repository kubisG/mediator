import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { modulesList } from "./modules-list";

@Module({
    imports: [
        ...modulesList,
    ],
    controllers: [AppController],
    providers: [
    ],
    exports: [
    ]
})
export class AppModule { }
