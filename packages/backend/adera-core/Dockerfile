FROM node:22-bullseye-slim AS build
ENV NODE_ENV=production
USER node
WORKDIR /opt/app

COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
COPY --chown=node:node packages/lib/common-enums/package.json packages/lib/common-enums/
COPY --chown=node:node packages/backend/adera-core/package.json packages/backend/adera-core/
RUN yarn workspaces focus adera-core

COPY --chown=node:node packages/lib/common-enums packages/lib/common-enums
COPY --chown=node:node packages/backend/adera-core packages/backend/adera-core
RUN yarn workspace adera-core build

FROM node:22-bullseye-slim AS install
ENV NODE_ENV production
USER node
WORKDIR /opt/app

COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
COPY --chown=node:node packages/lib/common-enums/package.json packages/lib/common-enums/
COPY --chown=node:node packages/backend/adera-core/package.json packages/backend/adera-core/
RUN yarn workspaces focus adera-core --production

FROM node:22-bullseye-slim AS runtime
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV APP_HOST=0.0.0.0
USER node
WORKDIR /opt/app

COPY --chown=node:node .yarn .yarn
COPY --chown=node:node --from=install /opt/app/.yarn/install-state.gz .yarn/
COPY --chown=node:node --from=install /opt/app/node_modules node_modules
COPY --chown=node:node --from=install /opt/app/packages packages
COPY --chown=node:node --from=install /opt/app/package.json /opt/app/yarn.lock /opt/app/.yarnrc.yml ./

COPY --chown=node:node packages/lib/common-enums packages/lib/common-enums
COPY --chown=node:node packages/backend/lib/prisma packages/backend/lib/prisma
COPY --chown=node:node --from=build /opt/app/packages/backend/adera-core/dist packages/backend/adera-core/dist

EXPOSE 3000
CMD ["yarn", "workspace", "adera-core", "prod"]
