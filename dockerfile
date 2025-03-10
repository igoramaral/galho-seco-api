FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run", "start:prod"]