import * as chokidar from "chokidar";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";

let running = false;

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

function attachNodemon(deps: string[]) {
    const watcher = chokidar.watch(deps, {
        persistent: true
    });
    const log = console.log.bind(console);
    let proc;
    watcher
        .on("change", (path) => {
            if (running) {
                return;
            }
            running = true;
            const splited = path.split("\\");
            const json = getJSON(`${splited[1]}`);
            console.log("CHANGED: ", path);
            const spawn = child_process.spawn;
            proc = child_process.exec(`npm run bundle -- --scope ${json.name}`, function (err, stdout, stderr) {
                console.log(err);
                console.log(stdout);
                console.log(stderr);
                running = false;
            });

            proc.stdout.on('data', function (data) {
                console.log(data);
            });
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

                }
            }
        }
    });
}

const args = process.argv;
const target = args[args.length - 1];
getTargetModuleDeps(target);
