module.exports = {
    apps: [
        {
            name: "ra-trader-be",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "production",
                "APP_MODE": "master",
            }
        },
        {
            name: "ra-trader-be-workers",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "production",
                "APP_MODE": "worker",
            }
        },
    ]
}
