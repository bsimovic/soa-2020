FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]