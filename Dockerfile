FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g forever
RUN npm install --only=production
COPY . .


# expose ports
EXPOSE 8080

#default environment variables
ENV NODE_ENV production
ENV PORT 8080

CMD ["forever", "server.js"]
