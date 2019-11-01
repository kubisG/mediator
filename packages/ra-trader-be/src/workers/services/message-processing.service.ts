import { Injectable, Inject } from "@nestjs/common";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { Connection, Repository } from "typeorm";
import { Side } from "@ra/web-core-be/dist/enums/side.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";
import { AllocStatus } from "@ra/web-core-be/dist/enums/alloc-status.enum";
import { RaMessage } from "../../entity/ra-message";
import { RaUser } from "../../entity/ra-user";
import { RaPortfolio } from "../../entity/ra-portfolio";

@Injectable()
export class MessageProcessingService {

    constructor(
        @Inject("logger") private logger: Logger,
        @Inject("DbConnection") private dbConnection: () => Connection,
    ) { }

    private isFillOrPartialFillExecution(msg: any) {
        return (msg.msgType === MessageType.Execution)
            && (msg.ExecType === ExecType.Fill || msg.ExecType === ExecType.PartialFill);
    }

    private isAckAllocation(msg: any) {
        return (msg.msgType === MessageType.AllocationInstructionAck) &&
            (msg.AllocStatus === AllocStatus.Accepted);
    }
    private async setCancelTransType(raMessageToken: Repository<RaMessage>, msg: any) {
        const oldMsg = await raMessageToken.findOne({ ExecID: msg.ExecRefID });
        await raMessageToken.update({ id: oldMsg.id }, { Canceled: "Y" });
        msg.LastQty = (Number(oldMsg.LastQty) * -1);
        msg.LastPx = oldMsg.LastPx;
    }

    private async setUserBalance(raUserToken: Repository<RaUser>, msg: any, user: RaUser, value: number, curr: string) {
        const currentBalance = value + (Number(user.currentBalance[curr]) ? Number(user.currentBalance[curr]) : 0);
        user.currentBalance[curr] = currentBalance;
        await raUserToken.save(user);
    }

    private async createPortfolio(raPortfolioToken: Repository<RaPortfolio>, user: RaUser, msg: any, curr: string, account: string
        ,                         bookPrice: number) {
        const portfolio = {
            Symbol: msg.Symbol,
            StockName: msg.SecurityDesc,
            Account: account,
            Profit: 0,
            BookPrice: bookPrice,
            Quantity: 0,
            user,
            company: user.company,
            FirstTrade: msg.Placed,
            Currency: curr,
        };
        return raPortfolioToken.create(portfolio);
    }

    private async calculatePortfolio(
        raPortfolioToken: Repository<RaPortfolio>, portfolio: any, value: any, msg: any, side: string,
    ) {
        portfolio["Profit"] = value + Number(portfolio["Profit"]);

        if ((Number(portfolio["Quantity"]) + (Number(msg.LastQty) * (side === Side.Buy ? 1 : -1)) !== 0)) {
            portfolio["BookPrice"] = portfolio["Profit"]
                / (Number(portfolio["Quantity"]) + (Number(msg.LastQty) * (side === Side.Buy ? 1 : -1)));
        }

        portfolio["BookPrice"] = Number(portfolio["BookPrice"]) < 0
            ? Number(portfolio["BookPrice"]) * -1 : Number(portfolio["BookPrice"]);
        portfolio["Quantity"] = Number(portfolio["Quantity"]) + (Number(msg.LastQty) * (side === Side.Buy ? 1 : -1));
        await raPortfolioToken.save(portfolio);
        return portfolio;
    }

    private async reCalculatePortfolio(
        raPortfolioToken: Repository<RaPortfolio>, portfolio: any, basicPortfolio: any, msg: any,
    ) {
        // move quantity from unallocated to account
        basicPortfolio.Quantity = basicPortfolio.Quantity - msg.Quantity;
        portfolio.Quantity = portfolio.Quantity + msg.Quantity;

        await raPortfolioToken.save(portfolio);
        await raPortfolioToken.save(basicPortfolio);
        return [portfolio, basicPortfolio];
    }

    public async processMessage(
        msg: any,
    ) {
        return await this.dbConnection().transaction(async (transactionalEntityManager) => {
            const raUserToken = transactionalEntityManager.getRepository(RaUser);
            const raPortfolioToken = transactionalEntityManager.getRepository(RaPortfolio);
            const raMessageToken = transactionalEntityManager.getRepository(RaMessage);

            if (msg.userId && this.isFillOrPartialFillExecution(msg)) {
                if (msg.ExecTransType === ExecTransType.Cancel) {
                    await this.setCancelTransType(raMessageToken, msg);
                }
                const userId = Number(msg.userId);
                const side = msg.Side;
                const value = Number(msg.LastPx) * Number(msg.LastQty) * (side === Side.Buy ? -1 : 1);
                const curr = msg.Currency ? msg.Currency : "USD";
                const user = await raUserToken.findOne({ id: userId }, { relations: ["company"] });
                await this.setUserBalance(raUserToken, msg, user, value, curr);
                // calculate profit for portfolio by currency
                let portfolio = {};
                if (msg.Account) {
                    portfolio = await raPortfolioToken.findOne({
                        Account: msg.Account, Symbol: msg.Symbol
                        , Currency: curr, user, company: user.company,
                    });
                } else {
                    portfolio = await raPortfolioToken.findOne({ Symbol: msg.Symbol, Currency: curr, user, company: user.company });
                }
                if (!portfolio) {
                    portfolio = await this.createPortfolio(raPortfolioToken, user, msg, curr, msg.Account, 0);
                }

                portfolio = await this.calculatePortfolio(raPortfolioToken, portfolio, value, msg, side);
                return {
                    userId, currentBalance: user.currentBalance
                    , openBalance: user.openBalance, portfolio, type: "balance",
                };
            } else if (msg.userId && this.isAckAllocation(msg)) {
                if (msg.AllocAccount) {
                    const userId = Number(msg.userId);
                    const curr = msg.Currency ? msg.Currency : "USD";
                    const user = await raUserToken.findOne({ id: userId }, { relations: ["company"] });
                    let portfolio = await raPortfolioToken.findOne({
                        Account: msg.AllocAccount, Symbol: msg.Symbol
                        , Currency: curr, user, company: user.company,
                    });

                    const basicPortfolio = await raPortfolioToken.findOne({
                        Symbol: msg.Symbol
                        , Currency: curr, user, company: user.company,
                    });

                    if (!portfolio) {
                        msg.SecurityDesc = basicPortfolio["StockName"];
                        msg.FirstTrade = basicPortfolio["FirstTrade"];
                        portfolio = await this.createPortfolio(raPortfolioToken, user, msg, curr, msg.AllocAccount
                            , basicPortfolio["BookPrice"]);
                    }

                    const portfolios = await this.reCalculatePortfolio(raPortfolioToken, portfolio, basicPortfolio, msg);
                    return {
                        userId, currentBalance: user.currentBalance
                        , openBalance: user.openBalance, portfolio: portfolios, type: "balances",
                    };
                }
            }
            return {};
        });
    }

}
