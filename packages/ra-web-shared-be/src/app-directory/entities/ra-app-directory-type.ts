import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, Unique } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { AEntity } from "@ra/web-core-be/db/a-entity";
import { RaAppDirectory } from "./ra-app-directory";

@Entity()
@Unique(["app"])
export class RaAppDirectoryType extends AEntity {

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
    @Column({ type: "jsonb" })
    public openfin: any;

    @OneToOne(type => RaAppDirectory, raAppDirectory => raAppDirectory.manifestDef) // specify inverse side as a second parameter
    @JoinColumn()
    app: RaAppDirectory;

}
