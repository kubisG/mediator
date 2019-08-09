import * as fs from "fs";
import { Logger } from "./logger";

const pwd = process.argv[process.argv.length - 1];

function readJsonFile(file: string) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeCoverage(cov: any) {
    fs.writeFileSync(`${pwd}/coverage.json`, JSON.stringify(cov), { encoding: "utf8", flag: "w" });
}

function start() {
    let lastCoverage;
    let newCoverage;
    try {
        lastCoverage = readJsonFile(`${pwd}/coverage.json`);
        newCoverage = readJsonFile(`${pwd}/coverage/coverage-summary.json`).total;
    } catch (ex) {

    }
    if (!newCoverage) {
        Logger.silly(`Missing coverage report!!!`);
        return;
    }
    if (!lastCoverage) {
        writeCoverage(newCoverage);
    } else {
        Logger.warn(`Result = New coverage ${newCoverage.lines.pct}%, Last coverage ${lastCoverage.lines.pct}%`);
        if (newCoverage.lines.pct < lastCoverage.lines.pct) {
            Logger.error("Need more test!!!");
            process.exit(1);
        } else {
            writeCoverage(newCoverage);
        }
    }
}

start();
