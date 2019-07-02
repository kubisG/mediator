import * as chokidar from "chokidar";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";

let running = false;
let changes = [];

function getJSON(file: string) {
    let packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
    let packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
    return packageJson;
}

function parseRaDeps(packageJson: any) {
    const deps: string[] = [];
    for (const name of Object.keys(packageJson.dependencies)) {
        if (name.indexOf("@ra/") > -1) {
            deps.push(`${name}`);
        }
    }
    return deps;
}

function getDepsFolders(deps: string[]) {
    const paths: string[] = [];
    const files = fs.readdirSync(path.resolve("packages"));
    for (const file of files) {
        if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
            try {
                let packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                let packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                if (deps.indexOf(packageJson.name) > -1) {
                    paths.push(`./packages/${file}/**/*.ts`);
                    paths.push(`./packages/${file}/*.ts`);
                    paths.push(`!./packages/${file}/**/*.d.ts`);
                    paths.push(`!./packages/${file}/*.d.ts`);
                    paths.push(`!./packages/${file}/node_modules`);
                }
            } catch (ex) {

            }
        }
    }
    return paths;
}

function runBundleFn() {
    if (changes.length === 0) {
        setTimeout(() => {
            runBundleFn();
        }, 500);
        return;
    }
    const path = changes[0];
    changes.shift();
    const splited = path.split("\\");
    const json = getJSON(`${splited[1]}`);
    console.log("CHANGED: ", path);
    const spawn = child_process.spawn;
    const proc = child_process.exec(`npm run bundle -- --scope ${json.name}`, function (err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
        runBundleFn();
    });
    proc.stdout.on('data', function (data) {
        console.log(data);
    });
}

function attachNodemon(deps: string[]) {
    const watcher = chokidar.watch(deps, {
        persistent: true
    });
    watcher
        .on("change", (path) => {
            changes.push(path);
        });
}

function getTargetModuleDeps(targetName: string) {
    fs.readdir(path.resolve("packages"), (err, files) => {
        for (const file of files) {
            if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
                try {
                    let packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                    let packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                    if (packageJson.name === targetName) {
                        const deps = parseRaDeps(packageJson);
                        const paths = getDepsFolders(deps);
                        attachNodemon(paths);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    });
}

const args = process.argv;
const target = args[args.length - 1];
runBundleFn();
getTargetModuleDeps(target);
