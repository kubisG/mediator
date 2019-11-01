import { Column, Entity, PrimaryGeneratedColumn, Index, PrimaryColumn, CreateDateColumn, BeforeInsert } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
export class RaOrderStoreAudit extends AEntity {

    @PrimaryGeneratedColumn()
    public uid: number;
    // deal ticket

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public id: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public OrderPackage: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Side: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ nullable: true })
    public OrderQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Symbol: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public OrdType: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    @Index()
    public Price: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Currency: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecInst: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TimeInForce: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExDestination: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public Text: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public BookingType: string;
    // blotters

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public StopPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ nullable: true })
    public CumQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public AvgPx: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public TargetCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public SenderCompID: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ nullable: true })
    public LastQty: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public LastPx: number;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value: any) => {
            return value === "" ? null : value;
        },
    })
    @Column({ nullable: true })
    public LeavesQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public OrdStatus: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public OrderID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public OrigClOrdID: string;

    // @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public Placed: Date;

    @Mapping({
        requirement: MappingRequirement.NULLABLE,
        transformation: (date: string) => {
            return new Date(date);
        },
    })
    @Column({
        type: "timestamptz",
        nullable: true,
    })
    public TransactTime: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public Account: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ClOrdLinkID: string;

    @Column({ nullable: true })
    public JsonMessage: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public RaID: string;

    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public Profit: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public userId: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public companyId: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updateDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public app: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public Allocated: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public AllocRejCode: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public ExecType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public msgType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public LastCapacity: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public LastLiquidityInd: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    @Index()
    public LocateReqd: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", nullable: true })
    public ExpireDate: Date;

    /**
     * 0 - default, sended
     * 1 - not sended
     * 2 - lock for resending
     * 3 - resended
     */
    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: 0 })
    public sended: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: "N" })
    public splitted: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public archDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public archType: string;

    @BeforeInsert()
    public setPlaced() {
        (this.Placed as any) = new Date().toISOString();
    }
}
