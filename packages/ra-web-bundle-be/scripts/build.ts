const project = process.argv[process.argv.length - 1];

if (!project || project === "") {
    throw new Error("Invalid argument");
}

const { spawn } = require('child_process');

const child = spawn(`rm -rf dist && tsc -p ./projects/${project}/tsconfig.json`, {
    shell: true
});

child.stdout.on("data", (chunk) => {
    console.log(chunk);
});

child.stderr.on("data", (chunk) => {
    console.log(chunk);
});

child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});
