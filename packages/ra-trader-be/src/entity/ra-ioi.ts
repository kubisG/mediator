import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaCompany } from "./ra-company";
import { RaUser } from "./ra-user";

@Entity()
@Index(["user", "company", "createDate", "ValidUntilTime"])
export class RaIoi extends AEntity {

/**
 *  TODO CHECK ATTRIBUTES FROM WIREFRAME
 */

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

    @Mapping(MappingRequirement.REQUIRED)
    @Column({ nullable: true })
    @Index()
    public IOIid: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public IOIRefID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public  IOITransType: string;

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (date: string) => {
            return new Date(date);
        }
    })
    @Column({
        type: "timestamptz",
        nullable: true,
    })
    @Index()
    public TransactTime: Date;

    @Mapping(MappingRequirement.REQUIRED)
    @Column({ nullable: true })
    public Symbol: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column({ nullable: true })
    public  Side: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public IOIQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public Price: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Currency: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ConfirmTo: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (date: string) => {
            return date === "" ? null : date ? new Date(date) : null;
        }
    })
    @Column({
        type: "timestamptz",
        nullable: true,
    })
    public ValidUntilTime: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TargetCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public ExDestination: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Text: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public JsonMessage: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public RaID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Canceled: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Type: string;

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
