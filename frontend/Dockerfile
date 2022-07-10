# pulling node image
FROM node:17.4.0-alpine

# creating home directory
WORKDIR /app

# taking all packages and installing node modules
# seperate for optimized caching
ADD package.json .
ADD package-lock.json .

RUN npm install

# adding all files
ADD . .

# running app
ENTRYPOINT [ "npm","start" ]