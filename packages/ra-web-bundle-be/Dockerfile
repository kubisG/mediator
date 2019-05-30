FROM keymetrics/pm2:latest-alpine as bundle

RUN apk add --no-cache python && \
    apk add --no-cache postgresql-dev g++ make && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache && \
    apk add --update alpine-sdk

# RUN pip install alpine-sdk

# Create app directory
WORKDIR /usr/src/bundle
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .
RUN npm run init && \
    npm run bundle && \
    npm cache clean --force && \
    npm run bootstrap --scope @ra/web-bundle-be && \
    npm run @ra/web-bundle-be && \
    rm -rf /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra/**/node_modules && \
    tar -hcf /tmp/ra-dep.tar /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra && \
    rm -rf /usr/src/bundle/packages/ra-web-bundle-be/node_modules/@ra && \
    tar -xf /tmp/ra-dep.tar -C /

FROM keymetrics/pm2:latest-alpine as start

RUN adduser -S rapidnode

WORKDIR /usr/src/app

RUN chown -R rapidnode /usr/src/app && \
    chmod 755 /usr/src/app

USER rapidnode

COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/node_modules ./node_modules
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/config ./config
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/dist ./dist
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/package*.json ./
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/inst-data ./inst-data
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/ecosystem.config.js ./
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-be/db ./db

EXPOSE 3000
# --log-date-format="YYYY-MM-DD HH:mm Z"
CMD ["pm2-runtime", "ecosystem.config.js","--log-date-format","'YYYY-MM-DD HH:mm Z'"]
