import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, Index, Unique, BeforeInsert, CreateDateColumn } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";
import { RaCompany } from "./ra-company";
import { RaUser } from "./ra-user";

@Entity()
@Unique(["UID"])
@Index(["user", "company", "TransactTime"])
export class RaMessage extends AEntity {

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
    @PrimaryGeneratedColumn()
    @Index()
    public UID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public msgType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public OrigClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TargetCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Side: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Symbol: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public OrderQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    @Index()
    public Price: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Currency: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TimeInForce: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public StopPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public CumQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public AvgPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public LastQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public LastPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        }
    })
    @Column({ nullable: true })
    public LeavesQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public OrdStatus: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public BookingType: string;

    // @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: new Date() })
    public Placed: Date;

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
    public Account: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ClOrdLinkID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecInst: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecTransType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public OrdType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public SenderCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public JsonMessage: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public OrdRejReason: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public Canceled: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecType: string;

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

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public RaID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public app: number;

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
    @Column({ type: "timestamptz", default: new Date() })
    public createDate: Date;

    /**
     * 0 - default, sended
     * 1 - not sended
     * 2 - lock for resending
     * 3 - resended
     */
    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: 0 })
    @Index()
    public sended: number;

    @BeforeInsert()
    public setPlaced() {
        (this.Placed as any) = new Date().toISOString();
    }
}
