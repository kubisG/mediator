import { Entity, PrimaryGeneratedColumn, Index, Column, BeforeUpdate } from "typeorm";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
export class RaInputRelations extends AEntity {

    constructor(relid?: number) {
        super();
        if (relid) {
            this.relid = relid;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public relid: number;

    @Column({ nullable: true })
    @Index()
    public parentId: number;

    @Column({ nullable: true })
    @Index()
    public rootId: number;

    @Column({ nullable: true })
    @Index()
    public childId: number;

    @Column({ default: 0 })
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
