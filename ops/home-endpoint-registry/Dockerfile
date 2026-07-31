ARG NODE_IMAGE=node:24-alpine
FROM ${NODE_IMAGE}

RUN apk add --no-cache ca-certificates git openssh-client tini

WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

RUN mkdir -p /state /run/secrets && chown node:node /state /run/secrets

USER node
ENTRYPOINT ["tini", "--", "node", "src/cli.mjs"]
CMD ["daemon"]
