import { spawnSync } from "child_process";

const formsInstall = spawnSync("node", ["../packages/ra-web-forms-be/dist/install.js"]);

console.log(`FORMS stderr: ${formsInstall.stderr.toString()}`);
console.log(`FORMS stdout: ${formsInstall.stdout.toString()}`);

const monitorInstall = spawnSync("node", ["../packages/ra-web-monitor-be/dist/install.js"]);

console.log(`MONITOR stderr: ${monitorInstall.stderr.toString()}`);
console.log(`MONITOR stdout: ${monitorInstall.stdout.toString()}`);
