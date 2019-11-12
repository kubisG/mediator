import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, Unique } from "typeorm";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "@ra/web-core-be/dist/db/entity/ra-company";
import { MappingRequirement, Mapping } from "light-mapper";

@Entity()
// @Unique(["dataType"])
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

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        },
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.user)
    public company: RaCompany;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
