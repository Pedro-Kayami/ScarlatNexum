FROM node:lts-alpine as node
 
FROM node AS builder
 
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
 
FROM node AS final
 
ENV NODE_ENV=production
ENV MONGO_DB_URL='please_set_mongo_db_url'
ENV PORT=3000
 
RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i -g pm2
COPY package*.json process.yml ./
RUN npm i --omit=dev --silent
USER node
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE ${PORT}
ENTRYPOINT ["pm2-runtime", "./process.yml"]