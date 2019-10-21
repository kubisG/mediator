import * as fs from "fs";
import { Logger } from "./logger";

function readJsonFile(file: string) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeCoverage(cov: any) {
    fs.writeFileSync("./coverage.json", JSON.stringify(cov), { encoding: "utf8", flag: "w" });
}

function start() {
    let lastCoverage;
    try {
        lastCoverage = readJsonFile("./coverage.json");
    } catch (ex) {

    }
    const newCoverage = readJsonFile("./coverage/coverage-summary.json").total;
    if (!lastCoverage) {
        writeCoverage(newCoverage);
    } else {
        Logger.warn(`Result = New coverage ${newCoverage.lines.pct}%, Last coverage ${lastCoverage.lines.pct}%`);
        if (newCoverage.lines.pct < lastCoverage.lines.pct) {
            Logger.error("Need more tests!!!");
            process.exit(1);
        } else {
            writeCoverage(newCoverage);
        }
    }
}

start();
