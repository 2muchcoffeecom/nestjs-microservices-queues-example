# Create image based off of the official Node 10 image
FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new dir
WORKDIR /app

# Copy dependency definitions
COPY ./app/package*.json /app/

# Install global dependecies
RUN npm i -g add nodemon
RUN npm i -g add ts-node

# Install dependecies
RUN npm i

# Get all the code needed to run the app
COPY ./app /app

# Build code
RUN ["npm", "run", "build"]
