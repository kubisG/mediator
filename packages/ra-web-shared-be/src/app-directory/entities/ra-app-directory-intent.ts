import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaAppDirectory } from "./ra-app-directory";

@Entity()
export class RaAppDirectoryIntent extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @ManyToOne(() => RaAppDirectory, (raAppDirectory) => raAppDirectory.intents)
    @Index()
    public app: RaAppDirectory;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    name: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    displayName: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    contexts: any;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    customConfig: any;

}
