module.exports = {
    apps: [
        {
            name: "ra-web-monitor-be",
            script: "./dist/main.js",
            instances: 2,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "dev",
                "APP_MODE": "master",
            }
        }
    ]
}
