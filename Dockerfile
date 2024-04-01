# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.10.0
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
# Create a stage for installing production dependecies.
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

# Use production node environment by default.
ENV LINK_WEBHOOK_MENSAGENS="http://localhost:8080"
ENV DB_MONGO='ScarlatDataBase'
ENV URL_MONGO="mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority"
ENV TOKEN_META="Bearer EAAJNmZCG2iSsBOwW5ZBCLZA4bEMyvDNL5tSLkuzK7npIQlkoh6ZALM9swYXCmsi6oMGQUWidrywR3mqqXZAMZAJ1xfiyJkyGBHjosoiye5VCZCBK95UeyMmfAHMsBagSnhNAN5EjzXgjdfrV3oedd2A1EZC2ZB8k1ZB1TcAutVn9uPapr7ER66jeBfnPylB0VYJOboK4pCMOx6GDBtMHaZCi06TNnX7ZATa7B281p0qL"
ENV URL_META=e'https://graph.facebook.com/v17.0/138522866009140/mssages'
ENV URL_META_MEDIA='https://graph.facebook.com/v17.0/138522866009140/media'
ENV TOKEN_TELEGRAM='6728340092:AAEHNLaBGyxbgd-F8Vhzp58j9iYfRkaOMPs'
ENV PORT=8080
ENV NODE_ENV='production'

RUN apk add --no-cache chromium \
    && npm i -g pm2 \
    && npx puppeteer browsers install chrome

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
