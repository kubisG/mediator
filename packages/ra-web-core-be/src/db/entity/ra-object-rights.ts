import { Column, Entity, Index, BeforeUpdate, PrimaryGeneratedColumn } from "typeorm";
import { AEntity } from "../a-entity";

@Entity()
@Index(["name", "userId", "companyId"], { unique: true })
export class RaObjectRights extends AEntity {

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Column()
    public name: string;

    @Column({ nullable: true, default: false })
    public read: boolean;

    @Column({ nullable: true, default: false })
    public write: boolean;

    @Column()
    public userId: number;

    @Column()
    public companyId: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public createDate: Date;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public updatedDate: Date;

    @BeforeUpdate()
    updateDates() {
        this.updatedDate = new Date();
    }
}
