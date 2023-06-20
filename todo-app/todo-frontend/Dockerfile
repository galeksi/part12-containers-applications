FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test


FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build"]