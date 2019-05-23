import { Column, Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, BeforeUpdate } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper/dist/lib/light-mapper.decorators";

import { AEntity } from "../a-entity";
import { RaCompany } from "./ra-company";

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

    @Column({ type: "timestamptz", nullable: true, default: () => 'CURRENT_TIMESTAMP' })
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

    @Mapping({
        requirement: MappingRequirement.REQUIRED,
        transformation: (companyId: number) => {
            return new RaCompany(companyId);
        }
    })
    @ManyToOne(() => RaCompany, (raCompany) => raCompany.user)
    public company: RaCompany;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
