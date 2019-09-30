const { spawnSync } = require("child_process");
const fs = require("fs");

const params = {
    project: ""
};

function setParams(args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] === "--project" && args[i + 1]) {
            params.project = args[i + 1];
        }
    }
}

function getProject(projectKey) {
    let rawdata = fs.readFileSync('./projects.json');
    return JSON.parse(rawdata).projects[projectKey];
}

function buildSimple() {
    //npm run docker-init
    var result = spawnSync("npm", ["run", "docker-init"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // npm run bundle
    result = spawnSync("npm", ["run", "bundle"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // npm cache clean --force
    result = spawnSync("npm", ["cache", "clean", "--force"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // npm run bootstrap -- --scope $project --include-filtered-dependencies
    result = spawnSync("npm", ["run", "bootstrap", "--", params.project, "--include-filtered-dependencies"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // npm run lerna -- run --scope $project build
    result = spawnSync("npm", ["run", "lerna", "--", "run", "--scope", params.project, "build"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // rm -rfv /usr/src/bundle/packages/$project/node_modules/@ra/**/node_modules
    result = spawnSync("rm", ["-rfv", `/usr/src/bundle/packages/${params.project}/node_modules/@ra/**/node_modules`]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // tar -hcf /tmp/ra-dep.tar /usr/src/bundle/packages/$project/node_modules/@ra
    result = spawnSync("tar", ["-hcf", "/tmp/ra-dep.tar", `/usr/src/bundle/packages/${params.project}/node_modules/@ra`]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // rm -rfv /usr/src/bundle/packages/$project/node_modules/@ra
    result = spawnSync("rm", ["-rfv", `/usr/src/bundle/packages/${params.project}/node_modules/@ra`]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
    // tar -xf /tmp/ra-dep.tar -C
    result = spawnSync("tar", ["-xf", "/tmp/ra-dep.tar", "-C"]);
    console.log(`stderr: ${result.stderr.toString()}`);
    console.log(`stdout: ${result.stdout.toString()}`);
}

function buildBundle(project) {
    for (const replacement of project.fileReplacements) {
        try {
            var result = spawnSync("rm", ["-rf", replacement.replace, " || :"]);
            console.log(`stderr: ${result.stderr.toString()}`);
            console.log(`stdout: ${result.stdout.toString()}`);
        } catch (ex) {

        }
        if (fs.lstatSync(replacement.with).isDirectory()) {
            try {
                var result = spawnSync("mkdir", [replacement.replace]);
                console.log(`stderr: ${result.stderr.toString()}`);
                console.log(`stdout: ${result.stdout.toString()}`);
                var result = spawnSync("cp", ["-r", replacement.with, replacement.replace]);
                console.log(`stderr: ${result.stderr.toString()}`);
                console.log(`stdout: ${result.stdout.toString()}`);
            } catch (ex) {

            }
        } else {
            var result = spawnSync("cp", [replacement.with, replacement.replace]);
            console.log(`11111 stderr: ${result.stderr.toString()}`);
            console.log(`stdout: ${result.stdout.toString()}`);
        }
    }
    params.project = project.package;
    buildSimple();
}

setParams(process.argv);
const project = getProject(params.project);
if (project) {
    buildBundle(project);
} else {
    buildSimple();
}
