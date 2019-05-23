import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, Index, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";
import { RaUser } from "./ra-user";


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

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public updatedDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public flgDel: string;

    @OneToMany(() => RaUser, (raUser) => raUser.company)
    public user: RaUser[];

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
