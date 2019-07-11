"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var workSpace = {
    folders: [],
    settings: {
        "files.exclude": {
            "**/*.d.ts": true,
            "**/*.js": true,
            "**/*.js.map": true
        }
    }
};
function parseRaDeps(packageJson) {
    var deps = [];
    for (var _i = 0, _a = Object.keys(packageJson.dependencies); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        if (name_1.indexOf("@ra/") > -1) {
            deps.push("" + name_1);
        }
    }
    return deps;
}
function getDepsFolders(deps) {
    var paths = [];
    var files = fs.readdirSync(path.resolve("packages"));
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
            try {
                var packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                var packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                if (deps.indexOf(packageJson.name) > -1) {
                    paths.push(file);
                    // paths.push(`./packages/${file}/**/*.ts`);
                    // paths.push(`./packages/${file}/*.ts`);
                    // paths.push(`!./packages/${file}/**/*.d.ts`);
                    // paths.push(`!./packages/${file}/*.d.ts`);
                    // paths.push(`!./packages/${file}/node_modules`);
                }
            }
            catch (ex) {
            }
        }
    }
    return paths;
}
function generateWokspace(name, paths) {
    workSpace.folders = [];
    for (var i = 0; i < paths.length; i++) {
        workSpace.folders.push({
            path: "..\\packages\\" + paths[i]
        });
    }
    fs.writeFileSync(path.resolve("workspaces", name + ".code-workspace"), JSON.stringify(workSpace));
}
function getModules() {
    fs.readdir(path.resolve("packages"), function (err, files) {
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
                try {
                    var packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                    var packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                    var deps = parseRaDeps(packageJson);
                    var paths = getDepsFolders(deps);
                    var workspace = [
                        file
                    ].concat(paths);
                    generateWokspace(file, workspace);
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        }
    });
}
getModules();
