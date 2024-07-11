# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.9.0
ARG PNPM_VERSION=8.15.5

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN pnpm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Use production node environment by default.
ENV NXZAP_LITE=false
ENV NXZAP_WPP=false
ENV URL_WEBHOOK_MENSAGENS="https://f97bd8845376d61608ed214000c1335a.serveo.net/api/v1/webhooks/atendimento/mensagens"
ENV DB_NAME='ScarlatDataBase2'
ENV TOKEN_META="Bearer EAAJNmZCG2iSsBO2oo3ywROEBgFZADuSKygGZC3Ttp6J4XxOkvh2i6IamZAV7o5f1F2IGFZAYFBfXgFZBVav0sD3efJUxgAiNb8BlXS5bjYYziA7XZBsoQ2tFRltf5b8bsAv1SwXJg5ZCY2m16MGXyjJ74ugSL5VKudzn6S3ZAl3HITDZAicBIG898JKubxVb9uZC0ZAkOQZDZD"
ENV CODE_META=138522866009140
ENV URL_META=https://graph.facebook.com/v19.0/
ENV TELEGRAM_BOT_TOKEN='6728340092:AAEHNLaBGyxbgd-F8Vhzp58j9iYfRkaOMPs'
ENV PORT=8090
ENV NODE_ENV='production'
ENV BOT_SYSTEM="Scarlat"
ENV BOT_NAME='Scarlat'
ENV BOT_VERSION='1.0.3'
ENV BOT_DESCRIPTION='Bot de atendimento'
ENV BOT_AUTHOR='Scarpins'
ENV DB_HOST='localhost'
ENV DB_PORT='27017'
ENV DB_URL='mongodb://mongodb:27017/'
ENV WHATSAPP_DEVICE_NAME='Testing_Nxzap'
ENV WHATSAPP_DEVICE_ID='1'
ENV FACEBOOK_PAGE_ID='138522866009140'
ENV FACEBOOK_APP_ID='138522866009140'
ENV FACEBOOK_APP_SECRET='138522866009140'
ENV INSTAGRAM_PAGE_ID='138522866009140'
ENV INSTAGRAM_APP_ID='138522866009140'
ENV INSTAGRAM_APP_SECRET='138522866009140'
ENV TWITTER_PAGE_ID='138522866009140'
ENV TWITTER_APP_ID='138522866009140'
ENV TWITTER_APP_SECRET='138522866009140'
ENV META_PAGE_ID='138522866009140'
ENV META_APP_ID='138522866009140'
ENV META_APP_SECRET='138522866009140'

RUN  npm i -g pm2

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    ffmpeg

RUN echo "kernel.unprivileged_userns_clone = 1" >> /etc/sysctl.conf

# Executa o comando sysctl para aplicar a configuração
RUN sysctl -p

RUN chown -R node:node /usr/src/app

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/process.yml ./process.yml

# Expose the port that the application listens on.
EXPOSE ${PORT}

# Run the application.
ENTRYPOINT ["pm2-runtime", "./process.yml"]
