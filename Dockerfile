FROM keymetrics/pm2:latest-alpine as bundle
ARG project
ARG params

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

# RUN npm run docker-init
# RUN npm run bundle
# RUN npm cache clean --force
# RUN npm run rimraf -- /usr/src/bundle/packages/$project/node_modules/**/node_modules
# RUN npm run rimraf -- /usr/src/bundle/packages/$project/node_modules/@ra/**/node_modules
# RUN chmod +x ./replace-symlinks.sh
# RUN find /usr/src/bundle/packages/$project/node_modules -maxdepth 2 -type l -exec ./replace-symlinks.sh '{}' \;
RUN node ./scripts/builder/builder.js --project $project

FROM keymetrics/pm2:latest-alpine as start
ARG project

RUN adduser -S rapidnode

WORKDIR /usr/src/app

RUN chown -R rapidnode /usr/src/app && \
    chmod 755 /usr/src/app

USER rapidnode

COPY --from=bundle /usr/src/bundle/packages/$project/config ./config
COPY --from=bundle /usr/src/bundle/packages/$project/node_modules ./node_modules
COPY --from=bundle /usr/src/bundle/node_modules ./node_modules
COPY --from=bundle /usr/src/bundle/packages/$project/dist ./dist
COPY --from=bundle /usr/src/bundle/packages/$project/package*.json ./
COPY --from=bundle /usr/src/bundle/packages/$project/ecosystem.config.js ./
COPY --from=bundle /usr/src/bundle/packages/$project/db ./db

EXPOSE 3000
# --log-date-format="YYYY-MM-DD HH:mm Z"
CMD ["pm2-runtime", "ecosystem.config.js","--log-date-format","'YYYY-MM-DD HH:mm Z'"]
