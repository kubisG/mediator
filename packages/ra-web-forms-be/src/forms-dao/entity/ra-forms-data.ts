import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "@ra/web-core-be/dist/db/entity/ra-company";

@Entity()
export class RaFormsData extends AEntity {

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
    public dataType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: "MAIN" })
    public subType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public name: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public status: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public accounts: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public alertMessage: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public emailAlert: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public emailAddress: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public triggeredCount: number;

    @Column({ type: "jsonb", nullable: true })
    public data: any;

    @Column({ type: "jsonb", nullable: true })
    public wsResponse: any;

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        },
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.user)
    public company: RaCompany;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public clientId: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public createdBy: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({nullable: true })
    public updatedBy: string;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }

    @BeforeInsert()
    insertDates() {
        this.createDate = new Date();
    }
}
