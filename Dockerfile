FROM node:14.8.0-alpine3.11
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
CMD yarn install
COPY . .
ENTRYPOINT [ "yarn", "start" ]
