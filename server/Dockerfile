FROM node

WORKDIR /server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5000

#CMD ["node", "index.js"]
CMD ["npm", "start"]

