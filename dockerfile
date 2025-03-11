FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN --mount=type=secret,id=env cat /run/secrets/env > .env
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run", "start:prod"]