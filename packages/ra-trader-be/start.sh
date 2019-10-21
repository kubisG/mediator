#!/bin/sh
ls -attr
npm run inst
pm2-runtime start ecosystem.config.js
