import { Entity, PrimaryGeneratedColumn, Index, Column, BeforeUpdate } from "typeorm";
import { AEntity } from "../a-entity";

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

    @Column({ nullable: true })
    @Index()
    public parentId: number;

    @Column({ nullable: true })
    @Index()
    public rootId: number;

    @Column()
    @Index()
    public label: string;

    @Column()
    public name: string;

    @Column()
    public value: string;

    @Column({ default: 0 })
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
