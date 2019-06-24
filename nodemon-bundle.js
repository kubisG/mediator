"use strict";
exports.__esModule = true;
var chokidar = require("chokidar");
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var running = false;
function getJSON(file) {
    var packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
    var packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
    return packageJson;
}
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
                    paths.push("./packages/" + file + "/**/*.ts");
                    paths.push("./packages/" + file + "/*.ts");
                    paths.push("!./packages/" + file + "/**/*.d.ts");
                    paths.push("!./packages/" + file + "/*.d.ts");
                    paths.push("!./packages/" + file + "/node_modules");
                }
            }
            catch (ex) {
            }
        }
    }
    return paths;
}
function attachNodemon(deps) {
    var watcher = chokidar.watch(deps, {
        persistent: true
    });
    var log = console.log.bind(console);
    var proc;
    watcher
        .on("change", function (path) {
        if (running) {
            return;
        }
        running = true;
        var splited = path.split("\\");
        var json = getJSON("" + splited[1]);
        console.log("CHANGED: ", path);
        var spawn = child_process.spawn;
        proc = child_process.exec("npm run bundle -- --scope " + json.name, function (err, stdout, stderr) {
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
function getTargetModuleDeps(targetName) {
    fs.readdir(path.resolve("packages"), function (err, files) {
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (fs.lstatSync(path.resolve("packages", file)).isDirectory()) {
                try {
                    var packageJsonRaw = fs.readFileSync(path.resolve("packages", file, "package.json"));
                    var packageJson = JSON.parse(packageJsonRaw.toString("utf8"));
                    if (packageJson.name === targetName) {
                        var deps = parseRaDeps(packageJson);
                        var paths = getDepsFolders(deps);
                        attachNodemon(paths);
                    }
                }
                catch (ex) {
                }
            }
        }
    });
}
var args = process.argv;
var target = args[args.length - 1];
getTargetModuleDeps(target);
