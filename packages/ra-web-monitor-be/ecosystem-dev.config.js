module.exports = {
    apps: [
        {
            name: "ra-web-monitor-be",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "dev",
                "APP_MODE": "master",
            }
        },
        {
            name: "ra-web-monitor-be-workers",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "dev",
                "APP_MODE": "worker",
            }
        }
    ]
}
