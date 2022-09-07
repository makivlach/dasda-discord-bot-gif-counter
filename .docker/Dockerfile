FROM node:18-alpine3.15

COPY . /app
COPY .env /app/.env

WORKDIR /app

RUN yarn install
RUN yarn build

VOLUME /app/dist/data
EXPOSE 3000

CMD ["yarn", "start:prod"]