import { Column, Entity, PrimaryColumn, Index, BeforeUpdate } from "typeorm";
import { AEntity } from "../a-entity";

@Entity()
@Index(["name", "userId", "companyId"], { unique: true })
export class RaPreference extends AEntity {

    @PrimaryColumn()
    @Index()
    public name: string;

    @Column()
    public value: string;

    @PrimaryColumn()
    public userId: number;

    @PrimaryColumn()
    public companyId: number;

    @Column({nullable: true, default: "1.0.0"})
    public version: string;

    @Column({nullable: true})
    public flag: string;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
