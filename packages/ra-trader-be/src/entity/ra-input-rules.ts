import { Entity, PrimaryGeneratedColumn, Index, Column, BeforeUpdate } from "typeorm";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";

@Entity()
export class RaInputRules extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Column()
    @Index()
    public label: string;

    @Column()
    public name: string;

    @Column()
    public value: string;

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
