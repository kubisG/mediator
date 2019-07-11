import * as fs from "fs";
import * as path from "path";

const workSpace = {
    folders: [],
    settings: {
        "files.exclude": {
            "**/*.d.ts": true,
            "**/*.js": true,
            "**/*.js.map": true
        }
    }
};

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
                    paths.push(file);
                    // paths.push(`./packages/${file}/**/*.ts`);
                    // paths.push(`./packages/${file}/*.ts`);
                    // paths.push(`!./packages/${file}/**/*.d.ts`);
                    // paths.push(`!./packages/${file}/*.d.ts`);
                    // paths.push(`!./packages/${file}/node_modules`);
                }
            } catch (ex) {

            }
        }
    }
    return paths;
}

function generateWokspace(name: string, paths: string[]) {
    workSpace.folders = [];
    for (let i = 0; i < paths.length; i++) {
        workSpace.folders.push({
            path: `..\\packages\\${paths[i]}`
        });
    }
    fs.writeFileSync(path.resolve("workspaces", `${name}.code-workspace`), JSON.stringify(workSpace));
}

function getModules() {
    fs.readdir(path.resolve("packages"), (err, files) => {
        for (const file of files) {
            if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
                try {
                    let packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                    let packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                    const deps = parseRaDeps(packageJson);
                    const paths = getDepsFolders(deps);
                    const workspace = [
                        file,
                        ...paths,
                    ]
                    generateWokspace(file, workspace);
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    });
}

getModules();
