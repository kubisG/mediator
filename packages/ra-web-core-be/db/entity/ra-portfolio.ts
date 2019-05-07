import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index, RelationId } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";
import { RaUser } from "./ra-user";
import { RaCompany } from "./ra-company";

@Entity()
@Index(["Symbol", "Currency", "user", "company"])
export class RaPortfolio extends AEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    @Index()
    public Symbol: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public StockName: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Account: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public RiskBeta: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({
        type: "timestamptz",
        nullable: true,
    })
    public FirstTrade: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Quantity: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public BookPrice: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Currency: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public CurrentPrice: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public Dividend: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public CapGain: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public Custodian: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "decimal", precision: 25, scale: 10, nullable: true })
    public Profit: number;

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (userId: number) => {
            return new RaUser(userId);
        }
    })
    @ManyToOne(() => RaUser, (raUser) => raUser.portfolio)
    public user: RaUser;

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.portfolio)
    public company: RaCompany;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public createDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public updateDate: Date;
}


