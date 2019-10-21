import { Substitute, Arg } from "@fluffy-spoon/substitute";

import { PortfolioService } from "./portfolio.service";
import { repository } from "../../mocks/dependecies/repository";
import { getAuthService } from "../../mocks/authentication/auth.service";
import { ObjectSubstitute } from "@fluffy-spoon/substitute/dist/src/Transformations";

describe("PortfolioService", () => {

    let portfolioService: PortfolioService;

    beforeEach(async () => {

        const raPortfolio = repository<RaPortfolio>();

        (raPortfolio as ObjectSubstitute<any>).findAndCount(Arg.all()).returns(Promise.resolve([[{
            id: 49,
            Symbol: "HSBA",
            StockName: "HSBA",
            Account: null,
            RiskBeta: null,
            FirstTrade: "2018-11-19T13:49:28.610Z",
            Quantity: -80,
            BookPrice: "40.0000000000",
            Currency: "USD",
            CurrentPrice: null,
            Dividend: null,
            CapGain: null,
            Custodian: null,
            Profit: "2400.0000000000",
            createDate: "2018-11-19T13:44:49.431Z",
            updateDate: "2018-11-19T13:44:49.431Z"
        }], 1]));

        portfolioService = new PortfolioService(
            raPortfolio,
            getAuthService(),
        );
    });

    describe("getPortfolio", () => {
        it("should be object with portofolio", async () => {
            const result = await portfolioService.findAndCount("fake-token-ok");
            expect(result).toEqual([[{
                id: 49,
                Symbol: "HSBA",
                StockName: "HSBA",
                Account: null,
                RiskBeta: null,
                FirstTrade: "2018-11-19T13:49:28.610Z",
                Quantity: -80,
                BookPrice: "40.0000000000",
                Currency: "USD",
                CurrentPrice: null,
                Dividend: null,
                CapGain: null,
                Custodian: null,
                Profit: "2400.0000000000",
                createDate: "2018-11-19T13:44:49.431Z",
                updateDate: "2018-11-19T13:44:49.431Z"
            }], 1]);
        });
        it("should throw exception", (done) => {
            done();
        });
    });

});
