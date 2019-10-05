const { execSync } = require("child_process");
const fs = require("fs");

const params = {
    project: "",
    rootDir: "/usr/src/bundle",
};

function setParams(args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] === "--project" && args[i + 1]) {
            params.project = args[i + 1];
        }
        if (args[i] === "--rootDir" && args[i + 1]) {
            if (args[i + 1].endsWith("/")) {
                args[i + 1] = args[i + 1].slice(0, -1);
            }
            params.rootDir = args[i + 1];
        }
    }
}

function getProject(projectKey) {
    let rawdata = fs.readFileSync('./projects.json');
    return JSON.parse(rawdata).projects[projectKey];
}

function execute(cmd) {
    console.log("RUN COMMAND:", cmd);
    var result = execSync(cmd);
    console.log(result.toString());
    // if (result.stderr && result.stderr.length > 0) {
    //     console.log(`stderr: ${result.stderr.toString()}`);
    // }
    // if (result.stdout && result.stdout.length > 0) {
    //     console.log(`stdout: ${result.stdout.toString()}`);
    // }
}

function buildSimple() {
    //npm run docker-init
    execute("npm run docker-init");
    // npm run bundle
    execute("npm run bundle");
    // npm cache clean --force
    execute("npm cache clean --force");
    // npm run rimraf -- /usr/src/bundle/packages/$project/node_modules/**/node_modules
    execute(`npm run rimraf -- ${params.rootDir}/packages/${params.project}/node_modules/**/node_modules`);
    // npm run rimraf -- /usr/src/bundle/packages/$project/node_modules/@ra/**/node_modules
    execute(`npm run rimraf -- ${params.rootDir}/packages/${params.project}/node_modules/@ra/**/node_modules`);
    // chmod +x ./replace-symlinks.sh
    execute("chmod +x ./replace-symlinks.sh");
    // find /usr/src/bundle/packages/$project/node_modules -maxdepth 2 -type l -exec ./replace-symlinks.sh '{}' \;
    execute(`find ${params.rootDir}/packages/${params.project}/node_modules -maxdepth 2 -type l -exec ./replace-symlinks.sh '{}' \\;`);
}

function buildBundle(project) {
    for (const replacement of project.fileReplacements) {
        var isDir = false;
        try {
            isDir = fs.lstatSync(replacement.with).isDirectory();
        } catch (ex) {

        }
        if (isDir) {
            try {
                execute(`cp -rfTv ${replacement.with} ${replacement.replace}`);
            } catch (ex) {

            }
        } else {
            execute(`cp -fv ${replacement.with} ${replacement.replace}`);
        }
    }
    var proj = params.project;
    params.project = project.package;
    buildSimple();
    execute(`mv ${params.rootDir}/packages/${params.project} ${params.rootDir}/packages/${proj}`);
}

setParams(process.argv);
const project = getProject(params.project);
if (project) {
    buildBundle(project);
} else {
    buildSimple();
}
