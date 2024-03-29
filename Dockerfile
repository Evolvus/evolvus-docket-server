FROM node:8.9-alpine as node

RUN npm install pm2@4.2.1 -g
# ENV PM2_PUBLIC_KEY XXXX
# ENV PM2_SECRET_KEY YYYY
COPY . /usr/app-docket-server/
COPY package.json /usr/app-docket-server
#COPY .npmrc ./
WORKDIR /usr/app-docket-server/
RUN npm install --only=production
#default environment variables
ENV NODE_ENV production
ENV PORT 8085
EXPOSE 8085
CMD ["pm2-runtime", "npm", "--", "start","-i max"]
