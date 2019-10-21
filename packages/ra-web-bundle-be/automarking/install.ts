import { spawnSync } from "child_process";

const formsInstall = spawnSync("node", ["./node_modules/ra-web-forms-be/dist/install.js"]);

console.log(`FORMS stderr: ${formsInstall.stderr.toString()}`);
console.log(`FORMS stdout: ${formsInstall.stdout.toString()}`);

if (formsInstall.status > 0) {
    process.exit(formsInstall.status);
}

const monitorInstall = spawnSync("node", ["./node_modules/ra-web-monitor-be/dist/install.js"]);

console.log(`MONITOR stderr: ${monitorInstall.stderr.toString()}`);
console.log(`MONITOR stdout: ${monitorInstall.stdout.toString()}`);

if (monitorInstall.status > 0) {
    process.exit(monitorInstall.status);
}
