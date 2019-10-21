import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "@ra/web-core-be/dist/db/entity/ra-company";

@Entity()
export class RaExchangeData extends AEntity {

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
    public recordId: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public table: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public type: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public status: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true})
    public previousRecord: string;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeInsert()
    insertDates() {
        this.createDate = new Date();
    }
}
