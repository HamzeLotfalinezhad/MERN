FROM node

# RUN npm install -g http-server
WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

# build client for production with minification
# RUN npm run build  

EXPOSE 3000

# CMD ["http-server", "dist"]
CMD ["npm", "start"]