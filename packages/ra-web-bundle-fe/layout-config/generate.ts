import { componentsList } from "./components";
import { defaultLayouts } from "./layout";
import * as fs from "fs";
import * as path from "path";

const COMPONENT_ARG = ["-c", "-components"];
const CONFIG_ARG = ["-config"];

let components: string[] = [];
const configs: string[] = [];

function parseArgs() {
    let setComponents = false;
    let setConfigs = false;
    for (const val of process.argv) {
        if (COMPONENT_ARG.indexOf(val) > -1) {
            setComponents = true;
            setConfigs = false;
            continue;
        }
        if (CONFIG_ARG.indexOf(val) > -1) {
            setComponents = false;
            setConfigs = true;
            continue;
        }
        if (setComponents) {
            components.push(val);
        }
        if (setConfigs) {
            configs.push(val);
        }
    }
}

function generateLayoutComponents() {

    const componentsImports: string[] = [];
    let componentsBody: string = `export const componentsList = [\n`;

    const modulesImports: string[] = [];
    let modulesBody: string = `export const modulesList = [\n`;

    const componentsModule: string[] = [];

    for (let i = 0; i < components.length; i++) {
        const component = componentsList[components[i]];
        if (!component) {
            throw Error("Component not exists in components.ts");
        }
        const componentImport = `import { ${component.type} } from "${component.import}";`;
        if (componentsImports.indexOf(componentImport) === -1) {
            componentsImports.push(componentImport);
        }
        const moduleImport = `import { ${component.module} } from "${component.import}";`;
        if (modulesImports.indexOf(moduleImport) === -1) {
            modulesImports.push(moduleImport);
        }

        componentsBody += `     {\n`
            + `         component: ${component.type},\n`
            + `         componentName: "${component.componentName}",\n`
            + `     },\n`;
        if (componentsModule.indexOf(component.module) === -1) {
            modulesBody += `    ${component.module},\n`;
            componentsModule.push(component.module);
        }
    }
    componentsBody += `];\n`;
    componentsBody = componentsImports.join("\n") + `\n\n` + componentsBody;
    modulesBody += `];\n`;
    modulesBody = modulesImports.join("\n") + `\n\n` + modulesBody;
    saveFiles(componentsBody, modulesBody);
}

function saveFiles(componentsBody: string, modulesBody: string) {
    fs.writeFileSync(path.resolve("src", "app", "components-list.ts"), componentsBody);
    fs.writeFileSync(path.resolve("src", "app", "modules-list.ts"), modulesBody);
}

function saveConfig() {
    if (configs.length === 0) {
        configs[0] = "default";
    }
    let configString = JSON.stringify(defaultLayouts[configs[0]]);
    configString = configString.replace("default-component", components[0]);
    configString = "export const layoutConfig = " + configString + ";";
    fs.writeFileSync(path.resolve("src", "app", "layout-config.ts"), configString);
}

parseArgs();
if (components.indexOf("all") > -1) {
    components = Object.keys(componentsList);
}
generateLayoutComponents();
saveConfig();
