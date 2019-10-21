import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "./ra-company";
import { RaUser } from "./ra-user";

@Entity()
@Index(["user", "company"])
export class RaAllocation extends AEntity {

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
    public msgType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public IndividualAllocID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public RefAllocID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocTransType: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public AllocShares: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocAccount: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocStatus: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocText: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public Commission: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public CommType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TargetCompID: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (date: string) => {
            return new Date(date);
        }
    })
    @Column({
        type: "timestamptz",
        nullable: true,
    })
    public TransactTime: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExDestination: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public JsonMessage: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public RaID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Canceled: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.message, { nullable: true })
    @Index()
    public company: RaCompany;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (userId: number) => {
            return new RaUser(userId);
        }
    })
    @ManyToOne(() => RaUser, (raUser) => raUser.message, { nullable: true })
    @Index()
    public user: RaUser;

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
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

}
