import { Column, Entity, Index, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { AEntity } from "../a-entity";

@Entity()
export class RaAuditTrail extends AEntity {

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Column()
    public recordId: number;

    @Column()
    public action: string;

    @Column()
    public data: string;

    @Column()
    public table: string;

    @Column()
    public user: string;

    @Column()
    public companyId: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @BeforeInsert()
    insertDates() {
        this.createDate = new Date();
    }
}
