import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class DbService {

    constructor(@Inject("DbConnection") public dbConnect: () => Connection) { }

}
