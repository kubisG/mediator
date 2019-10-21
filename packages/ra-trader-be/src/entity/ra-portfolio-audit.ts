import { Column, Entity, Index } from "typeorm";
import { Mapping, MappingRequirement } from "light-mapper";

import { RaPortfolio } from "./ra-portfolio";

@Entity()
export class RaPortfolioAudit extends RaPortfolio {

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    public archDate: Date;

    @Mapping(MappingRequirement.OPTIONAL)
    @Column({ nullable: true })
    public archType: string;
}


