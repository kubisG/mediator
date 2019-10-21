import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, Index, ManyToOne } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaUser } from "./ra-user";
import { RaCompany } from "./ra-company";


@Entity()
export class RaOrderRel extends AEntity {

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
    public parentId: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column({ nullable: true })
    public childId: number;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    public parentClOrdId: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column({ nullable: true })
    public childClOrdId: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ default: 0 })
    public OrderQty: number;

    @ManyToOne(() => RaUser, (raUser) => raUser.orderRel, { nullable: true })
    public user: RaUser;


    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.orderRel)
    public company: RaCompany;


}
