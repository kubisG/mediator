import * as dotenv from "dotenv";
import * as fastRandom from "fast-random";
import { Channel, Connection, Options, connect } from "amqplib";

dotenv.config();

const random = fastRandom(new Date().getTime());

const responses = [
    // (order) => {
    //     return {
    //         msgType: "Execution",
    //         ExecType: "Cancel",
    //         OrderID: order.OrderID,
    //         ClOrdID: order.ClOrdID,
    //         createDate: new Date(),
    //         SessionId: "/MROUTER#jkIgOqfnx6geIRluAAAL",
    //         RequestId: "catch:/MROUTER#jkIgOqfnx6geIRluAAAL:general"
    //     };
    // },
    (order) => {
        return {
            msgType: "Execution",
            ExecType: "Cancel",
            OrderID: order.OrderID,
            ClOrdID: random.nextInt(),
            OrigClOrdID: order.ClOrdID,
            createDate: new Date(),
            SessionId: "/MROUTER#jkIgOqfnx6geIRluAAAL",
            RequestId: "catch:/MROUTER#jkIgOqfnx6geIRluAAAL:general"
        };
    },
    // (order) => {
    //     order.OrdStatus = "Filled";
    //     order.CumQty = order.OrderQty;
    //     order.LeavesQty = 0;
    //     order.createDate = new Date();
    //     return order;
    // },
    // (order) => {
    //     const partFillQty = Math.round(order.OrderQty / 2);
    //     order.OrdStatus = "PartialFill";
    //     order.CumQty = order.OrderQty - partFillQty;
    //     order.LeavesQty = partFillQty;
    //     order.createDate = new Date();
    //     return order;
    // },
    // (order) => {
    //     return {
    //         msgType: "Execution",
    //         ExecType: "Bust",
    //         OrderID: order.OrderID,
    //         ClOrdID: order.ClOrdID,
    //         OrdRejReason: "BrokerOption",
    //         createDate: new Date(),
    //         SessionId: "/MROUTER#NzoF4Dz1kkC8C-auAAAZ",
    //         RequestId: "catch:/MROUTER#NzoF4Dz1kkC8C-auAAAZ:general"
    //     };
    // },
    (order) => {
        return {
            msgType: "Execution",
            ExecType: "Bust",
            OrderID: order.OrderID,
            ClOrdID: random.nextInt(),
            OrigClOrdID: order.ClOrdID,
            OrdRejReason: "BrokerOption",
            createDate: new Date(),
            SessionId: "/MROUTER#NzoF4Dz1kkC8C-auAAAZ",
            RequestId: "catch:/MROUTER#NzoF4Dz1kkC8C-auAAAZ:general"
        };
    },
];

function generateResponse(content) {
    const rand = Math.floor(Math.random() * ((responses.length - 1) + 1));
    console.log(`GENERATE RESPONSE FOR ${content.OrderID}`);
    return responses[rand](content);
}

const config: Options.Connect = {
    protocol: "amqp",
    hostname: process.env.RABBIT_MQ_HOST,
    port: Number(process.env.RABBIT_MQ_PORT),
    username: process.env.RABBIT_MQ_USER,
    password: process.env.RABBIT_MQ_PASSWORD,
};

connect(config).then((connection) => {
    console.log("CONNECTED TO MQ");
    connection.createChannel().then((channel) => {
        channel.consume(process.env.RABBIT_TRADER_MQ_QUEUE, (msg) => {
            const content = JSON.parse(msg.content.toString());
            channel.ack(msg);
            content.OrderID = new Date().getTime();
            console.log(`ROUTE MESSAGE TO ${content.SenderCompID}`);
            channel.sendToQueue(content.SenderCompID, Buffer.from(JSON.stringify(content)));
            setTimeout((cha, cont) => {
                const rand = Math.floor(Math.random() * ((2 - 1) + 1));
                let cnt = cont;
                for (let i = 0; i < 4; i++) {
                    cnt = generateResponse(cnt);
                    cha.sendToQueue(cont.SenderCompID, Buffer.from(JSON.stringify(cnt)));
                }
            }, 5000, channel, content);
        });
    }).catch((err) => {
        console.log(err);
    });
}).catch((err) => {
    console.log(err);
});
