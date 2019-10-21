import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaOrderStore } from "./ra-order-store";
import { RaCompany } from "./ra-company";
import { RaMessage } from "./ra-message";
import { RaPortfolio } from "./ra-portfolio";
import { RaOrderRel } from "./ra-order-rel";

@Entity()
export class RaUser extends AEntity {

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
    @Column({ default: 0 })
    public app: number;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ unique: true })
    public username: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column()
    public password: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column()
    public firstName: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column()
    public lastName: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public deskPhone: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public mobile: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ unique: true })
    public email: string;

    @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", nullable: true })
    public lastLogin: Date;

    @Column({ type: "timestamptz", nullable: true })
    public lastAction: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true, default: "USER" })
    public class: string;

    @Column({ nullable: true })
    public flgDel: string;

    @Column({ nullable: true })
    public spliting: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    public openBalance: any;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    public currentBalance: any;

    @OneToMany(() => RaOrderStore, (raOrderStore) => raOrderStore.user)
    public store: RaOrderStore[];

    @OneToMany(() => RaPortfolio, (raPortfolio) => raPortfolio.user)
    public portfolio: RaPortfolio[];

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.user)
    public company: RaCompany;

    @OneToMany(() => RaMessage, (raMessage) => raMessage.user)
    public message: RaMessage;

    @OneToMany(() => RaOrderRel, (raOrderRel) => raOrderRel.user)
    public orderRel: RaOrderRel;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
