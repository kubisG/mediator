import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";
import { AEntity } from "@ra/web-core-be/db/a-entity";
import { RaAppDirectoryIntent } from "./ra-app-directory-intent";

@Entity()
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
    public intents: RaAppDirectoryIntent;

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

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.stringify(value)
    })
    @Column({ nullable: true })
    images: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    contactEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    supportEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    publisher: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.stringify(value)
    })
    @Column({ nullable: true })
    icons: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.stringify(value)
    })
    @Column({ nullable: true })
    customConfig: string;

}
