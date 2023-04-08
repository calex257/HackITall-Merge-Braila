# Use Ubuntu 20.04 as the base image
FROM node:18-alpine

# Install required packages


# Set the working directory

COPY package*.json ./

WORKDIR .

# Copy the package.json and package-lock.json files for both client and server

RUN npm install
COPY . .



