import { Routes } from "@angular/router";
import { PortfolioLayoutComponent } from "./portfolio-layout/portfolio-layout.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";

export const portfolioLayoutRoutes: Routes = [
    { path: "", component: PortfolioLayoutComponent,
        children: [
            { path: "", component: PortfolioComponent },
        ],
    },
];
