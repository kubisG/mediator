"use strict";
exports.__esModule = true;
var fs = require("fs");
var logger_1 = require("./logger");
var pwd = process.argv[process.argv.length - 1];
function readJsonFile(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeCoverage(cov) {
    fs.writeFileSync(pwd + "/coverage.json", JSON.stringify(cov), { encoding: "utf8", flag: "w" });
}
function start() {
    var lastCoverage;
    var newCoverage;
    try {
        lastCoverage = readJsonFile(pwd + "/coverage.json");
        newCoverage = readJsonFile(pwd + "/coverage/coverage-summary.json").total;
    }
    catch (ex) {
    }
    if (!newCoverage) {
        logger_1.Logger.silly("Missing coverage report!!!");
        return;
    }
    if (!lastCoverage) {
        writeCoverage(newCoverage);
    }
    else {
        logger_1.Logger.warn("Result = New coverage " + newCoverage.lines.pct + "%, Last coverage " + lastCoverage.lines.pct + "%");
        if (newCoverage.lines.pct < lastCoverage.lines.pct) {
            logger_1.Logger.error("Need more test!!!");
            process.exit(1);
        }
        else {
            writeCoverage(newCoverage);
        }
    }
}
start();
