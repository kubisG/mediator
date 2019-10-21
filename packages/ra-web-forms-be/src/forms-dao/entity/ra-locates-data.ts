import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "@ra/web-core-be/dist/db/entity/ra-company";

@Entity()
export class RaLocatesData extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: "Notice"})
    public reqType: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public user: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public symbol: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public quantity: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public broker: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public comment: string;

    // @Mapping(MappingRequirement.OPTIONAL)
    // @Column({ nullable: true, default: 0 })
    // public goodShares: number;

    // @Mapping(MappingRequirement.OPTIONAL)
    // @Column({ nullable: true, default: 0 })
    // public noGoodShares: number;

    // @Mapping(MappingRequirement.OPTIONAL)
    // @Column({ nullable: true, default: 0 })
    // public pendingShares: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true, default: 0 })
    public usedShares: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true, default: 0 })
    public availableShares: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public orderId: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public repId: string;

    @Column({ default: "New"})
    public status: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: "Firm"})
    public poolType: string;

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
    @Column({ nullable: true })
    public createdBy: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
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
