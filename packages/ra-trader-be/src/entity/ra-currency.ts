import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Index, Unique } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
@Unique(["from", "to"])
export class RaCurrency extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Column()
    public from: string;

    @Column()
    public to: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public price: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (date: string) => {
            if (date) {
                return new Date(date);
            } else {
                return new Date();
            }
        }
    })
    @Column({ type: "timestamptz" })
    public date: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

}
