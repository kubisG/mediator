import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, Index, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";
import { RaOrderStore } from "./ra-order-store";
import { RaUser } from "./ra-user";
import { RaMessage } from "./ra-message";
import { RaPortfolio } from "./ra-portfolio";
import { RaAccounts } from "./ra-accounts";
import { RaCounterParty } from "./ra-counter-party";
import { RaOrderRel } from "./ra-order-rel";


@Entity()
export class RaCompany extends AEntity {

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
    public companyName: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public ClientID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public street: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public city: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public numInStreet: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public state: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public partyRole: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public partyID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public partyIDSource: string;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public updatedDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public flgDel: string;

    @OneToMany(() => RaOrderStore, (raOrderStore) => raOrderStore.company)
    public store: RaOrderStore[];

    @OneToMany(() => RaPortfolio, (raPortfolio) => raPortfolio.company)
    public portfolio: RaPortfolio[];

    @OneToMany(() => RaUser, (raUser) => raUser.company)
    public user: RaUser[];

    @OneToMany(() => RaMessage, (raMessage) => raMessage.company)
    public message: RaMessage[];

    @OneToMany(() => RaAccounts, (raAccounts) => raAccounts.company)
    public account: RaAccounts[];

    @OneToMany(() => RaCounterParty, (raCounterParty) => raCounterParty.company)
    public counterParty: RaCounterParty[];

    @OneToMany(() => RaOrderRel, (raOrderRel) => raOrderRel.company)
    public orderRel: RaOrderRel[];

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
