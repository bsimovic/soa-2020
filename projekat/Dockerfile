FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD package*.json /app/
RUN npm install
COPY . /app/
CMD ["npm", "start"]