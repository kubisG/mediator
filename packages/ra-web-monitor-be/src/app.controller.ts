import { Controller } from "@nestjs/common";

@Controller()
export class AppController {

    root() {
        return "Hello World!";
    }

}
