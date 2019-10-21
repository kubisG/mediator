import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { environment } from "@ra/web-env-be/dist/environment";
import * as dotenv from "dotenv";

declare const module: any;

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(environment.appPort);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
