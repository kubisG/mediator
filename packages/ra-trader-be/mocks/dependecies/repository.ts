import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { Repository } from "typeorm";

export function repository<Entity>() {
    return Substitute.for<Repository<Entity>>();
}
