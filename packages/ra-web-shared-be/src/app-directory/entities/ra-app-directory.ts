import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, Unique } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { AEntity } from "@ra/web-core-be/dist/db/a-entity";
import { RaAppDirectoryIntent } from "./ra-app-directory-intent";
import { RaAppDirectoryType } from "./ra-app-directory-type";
@Entity()
@Unique(["appId"])
export class RaAppDirectory extends AEntity {

    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @OneToMany(() => RaAppDirectoryIntent, (raAppDirectoryIntent) => raAppDirectoryIntent.app)
    public intents: RaAppDirectoryIntent[];

    @OneToOne(type => RaAppDirectoryType, raAppDirectoryType => raAppDirectoryType.app)
    manifestDef: RaAppDirectoryType;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    appId: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    name: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    manifest: string;

    @Mapping(MappingRequirement.REQUIRED)
    @Column()
    manifestType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    version: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    title: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    tooltip: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    description: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    images: any;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    contactEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    supportEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    publisher: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    icons: any;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "jsonb", nullable: true })
    customConfig: any;

}
