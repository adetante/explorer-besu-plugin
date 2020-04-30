FROM node:14.0 as builder

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM alethio/ethereum-lite-explorer:latest
ARG PLUGIN_VERSION

COPY --from=builder /build/dist/ /usr/share/nginx/html/plugins/adetante/besu/${PLUGIN_VERSION}
COPY .docker/config.default.json .
COPY .docker/set-env-vars.js .
