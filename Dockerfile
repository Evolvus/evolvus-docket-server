FROM node:8.6 as node

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
RUN npm install --only=production

COPY . .


#default environment variables
ENV NODE_ENV production
ENV PORT 8085
EXPOSE 8085
CMD ["npm", "start"]
