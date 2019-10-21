import { Entity, PrimaryGeneratedColumn, Index, Column, ManyToOne, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { RaCompany } from "./ra-company";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
export class RaAccounts extends AEntity {

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

    @Mapping(MappingRequirement.OPTIONAL)
    @Column()
    @Index()
    public name: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column()
    @Index()
    public code: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public info: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public settlement1: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public settlement2: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public active: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public counterParty: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.account, { nullable: true })
    @Index()
    public company: RaCompany;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
