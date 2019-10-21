import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
export class RaRulesData extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public recordId: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public clientId: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public type: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public data: string;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @BeforeInsert()
    insertDates() {
        this.createDate = new Date();
    }
}
