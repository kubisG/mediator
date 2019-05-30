FROM node:10.15-alpine as bundle

RUN apk add --no-cache python && \
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

RUN npm cache clean --force && \
    npm run init && \
    npm run bundle && \
    npm run ra-web-bundle-fe

FROM nginx:1.15.8-alpine as start

WORKDIR /usr/src/app

RUN chown -R nginx /usr/src/app && \
    chmod 755 /usr/src/app

COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-fe/dist/ra-*/assets ./assets
COPY --from=bundle /usr/src/bundle/packages/ra-web-bundle-fe/dist/ra-*/*.* ./

CMD ["nginx", "-g", "daemon off;"]
