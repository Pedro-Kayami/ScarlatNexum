FROM node:lts-alpine as node

FROM node AS builder

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node AS final

ENV LINK_WEBHOOK_MENSAGENS="http://localhost:8080"
ENV DB_MONGO='ScarlatDataBase'
ENV URL_MONGO="mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority"
ENV TOKEN_META="Bearer EAAJNmZCG2iSsBOwW5ZBCLZA4bEMyvDNL5tSLkuzK7npIQlkoh6ZALM9swYXCmsi6oMGQUWidrywR3mqqXZAMZAJ1xfiyJkyGBHjosoiye5VCZCBK95UeyMmfAHMsBagSnhNAN5EjzXgjdfrV3oedd2A1EZC2ZB8k1ZB1TcAutVn9uPapr7ER66jeBfnPylB0VYJOboK4pCMOx6GDBtMHaZCi06TNnX7ZATa7B281p0qL"
ENV URL_META=e'https://graph.facebook.com/v17.0/138522866009140/mssages'
ENV URL_META_MEDIA='https://graph.facebook.com/v17.0/138522866009140/media'
ENV TOKEN_TELEGRAM='6728340092:AAEHNLaBGyxbgd-F8Vhzp58j9iYfRkaOMPs'
ENV PORT=8080

RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i -g pm2
COPY package*.json process.yml ./
RUN npm i --omit=dev
USER node
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE ${PORT}
ENTRYPOINT ["pm2-runtime", "./process.yml"]
