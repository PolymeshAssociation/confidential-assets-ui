################################################################
################################################################
################################################################

ARG DEBIAN_VERSION=bookworm

################################################################

ARG NODE_VERSION=22
ARG NODE_CONTAINER_TAG=${NODE_VERSION}-${DEBIAN_VERSION}-slim

################################################################
################################################################
################################################################

FROM node:${NODE_CONTAINER_TAG} AS builder

################################################################

USER root
RUN corepack enable && \
    corepack prepare pnpm@10.23.0 --activate && \
    npm i -g node-gyp

################################################################

# npm package dependencies:

RUN apt-get update && \
    apt-get install -y python3 python-is-python3 make g++

################################################################

WORKDIR /srv

################################################################

RUN chown -R node:node /srv/ && \
    chmod 0750 /srv/

COPY --chown=node:node package.json pnpm-lock.yaml /srv/
RUN chmod 0640 /srv/package.json /srv/pnpm-lock.yaml

# Copy local packages needed for install
COPY --chown=node:node local_packages/ /srv/local_packages/

################################################################

USER node
RUN pnpm install --frozen-lockfile

################################################################

COPY --chown=node:node . /srv
RUN sed -n 's/^\(.*\)=.*$/\1=__\1__/p' .env.example > .env.production && \
    bash -ac "source .env.production && pnpm build"

RUN cat /srv/.env.production | \
    xargs -I{} bash -c "echo '{}' | sed 's/^\\(.*\\)=.*$/\\1/' >> /srv/env.var.list"

################################################################
################################################################
################################################################

FROM nginx:stable-bookworm

################################################################

COPY --chown=root:root --from=builder /srv/dist /usr/share/nginx/html

################################################################

COPY --from=builder /srv/env.var.list /srv/env.var.list
COPY --chown=root:root replace-env-var-placeholders.sh /usr/local/bin/replace-env-var-placeholders.sh
COPY --chown=root:root nginx.conf /etc/nginx/conf.d/default.conf

################################################################

ENV VITE_POLYMESH_NODE_URL=VITE_POLYMESH_NODE_URL_NOT_SET
ENV VITE_SUBQUERY_URL=VITE_SUBQUERY_URL_NOT_SET
ENV VITE_ONBOARDING_URL=VITE_ONBOARDING_URL_NOT_SET
ENV VITE_EXPLORER_URL=VITE_EXPLORER_URL_NOT_SET
ENV VITE_MIN_PASSWORD_LENGTH=12
ENV VITE_ENABLE_BREACH_CHECK=true

################################################################

EXPOSE 80/tcp

################################################################

CMD replace-env-var-placeholders.sh && \
    nginx -g 'daemon off;'

################################################################
################################################################
################################################################
