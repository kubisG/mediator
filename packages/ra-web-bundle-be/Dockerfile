FROM keymetrics/pm2:latest-alpine as bundle
ARG project

RUN apk add --no-cache python && \
    apk add --no-cache postgresql-dev g++ make && \
    apk add --no-cache bzip2 && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache && \
    apk add --update alpine-sdk

WORKDIR /usr/src/bundle
# copy and install ra-web's package.json for managing tools
COPY package*.json ./
RUN npm install

# copy all
COPY . .

RUN npm run init && \
    npm run bundle && \
    npm cache clean --force && \
    npm run bootstrap -- --scope @ra/web-bundle-be --include-filtered-dependencies && \
    npm --prefix packages/ra-web-bundle-be run package -- $project && \
    rm -rfv /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra/**/node_modules && \
    tar -hcf /tmp/ra-dep.tar /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra && \
    rm -rfv /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra && \
    tar -xf /tmp/ra-dep.tar -C /

FROM keymetrics/pm2:latest-alpine as start
ARG project

RUN adduser -S rapidnode

WORKDIR /usr/src/app

RUN chown -R rapidnode /usr/src/app && \
    chmod 755 /usr/src/app

USER rapidnode

COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/node_modules ./node_modules
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/dist ./dist
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/package*.json ./
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/projects/$project/ecosystem.config.js ./
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/projects/$project/config ./config

EXPOSE 3000
# --log-date-format="YYYY-MM-DD HH:mm Z"
CMD ["pm2-runtime", "ecosystem.config.js","--log-date-format","'YYYY-MM-DD HH:mm Z'"]
