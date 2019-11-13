import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, Unique } from "typeorm";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { MappingRequirement, Mapping } from "light-mapper";

@Entity()
@Unique(["dataType", "companyId"])
export class RaFormsSpec extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @Mapping(MappingRequirement.OPTIONAL)
    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public dataType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: "MAIN" })
    public subType: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public name: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    public spec: any;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public createdBy: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public updatedBy: string;

    @Column()
    public companyId: number;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
