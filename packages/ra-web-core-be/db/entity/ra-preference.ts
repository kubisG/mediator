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

    @Column({ type: "timestamptz", default: new Date() })
    public createDate: Date;

    @Column({ type: "timestamptz", default: new Date() })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
