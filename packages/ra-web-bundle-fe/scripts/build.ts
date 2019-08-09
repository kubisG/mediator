import * as fs from "fs";

const project = process.argv[process.argv.length - 1];

if (!project || project === "") {
    throw new Error("Invalid argument");
}

function replaceInFile(file: string, replace: string, replacement: string) {
    const content = fs.readFileSync(file, "utf8");
    return content.replace(new RegExp(replace, "g"), replacement);
}

const replaced = replaceInFile(`scripts/angular.json`, "targetProjectReplacement", project);
fs.writeFileSync("./angular.json", replaced, { encoding: "utf8", flag: "w" });

// const { spawn } = require("child_process");

// const child = spawn(`rm -rf dist && tsc -p ./projects/${project}/tsconfig.json`, {
//     shell: true
// });

// child.stdout.on("data", (chunk) => {
//     console.log(chunk);
// });

// child.stderr.on("data", (chunk) => {
//     console.log(chunk);
// });

// child.on("close", (code) => {
//     console.log(`child process exited with code ${code}`);
// });
