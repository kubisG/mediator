import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Index, Unique } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";

@Entity()
@Unique(["symbol", "priceDate"])
export class RaStock extends AEntity {

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
    public symbol: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public startPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public lastPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public highPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public lowPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public volume: number;

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
    public priceDate: Date;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public createDate: Date;

}
