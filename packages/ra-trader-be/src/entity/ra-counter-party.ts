import { Entity, PrimaryGeneratedColumn, Index, Column, ManyToOne, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "./ra-company";

@Entity()
export class RaCounterParty extends AEntity {

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
    @Column({ nullable: true })
    public ExDestination: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public CounterParty: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public DeliveryToCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public otherInfo: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public CommType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Commission: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public active: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public type: number;

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
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.counterParty, { nullable: true })
    @Index()
    public company: RaCompany;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}


