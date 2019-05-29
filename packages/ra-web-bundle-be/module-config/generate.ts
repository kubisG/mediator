import * as fs from "fs";
import * as path from "path";
import { modulesList } from "./modules";

const MODULES_ARG = ["-m", "-modules"];

let modules: string[] = [];

function parseArgs() {
    let setModules = false;
    for (const val of process.argv) {
        if (MODULES_ARG.indexOf(val) > -1) {
            setModules = true;
            continue;
        }
        if (setModules) {
            modules.push(val);
        }
    }
}

function generateLayoutComponents() {

    const modulesImports: string[] = [];
    let modulesBody: string = `export const modulesList = [\n`;

    for (let i = 0; i < modules.length; i++) {
        const mod = modulesList[modules[i]];
        if (!mod) {
            throw Error("Module not exists in modules.ts");
        }
        const moduleImport = `import { ${mod.type} } from "${mod.import}";`;
        if (modulesImports.indexOf(moduleImport) === -1) {
            modulesImports.push(moduleImport);
        }
        modulesBody += `    ${mod.type},\n`;
    }
    modulesBody += `];\n`;
    modulesBody = modulesImports.join("\n") + `\n\n` + modulesBody;
    saveFiles(modulesBody);
}

function saveFiles(modulesBody: string) {
    fs.writeFileSync(path.resolve("src", "modules-list.ts"), modulesBody);
}

parseArgs();
if (modules.indexOf("all") > -1) {
    modules = Object.keys(modulesList);
}
generateLayoutComponents();
