module.exports = {
    apps: [
        {
            name: "ra-trader-be",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "dev",
                "APP_MODE": "master",
            }
        },
        {
            name: "ra-trader-be-workers",
            script: "./dist/main.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "dev",
                "APP_MODE": "worker",
            }
        },
        {
            name: "ra-install",
            script: "./dist/install.js",
            autorestart: false,
        },
    ]
}
