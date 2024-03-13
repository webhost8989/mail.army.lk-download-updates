
# Sample Dockerfile for NodeJS Apps

FROM node:14

ENV NODE_ENV=production

WORKDIR /appfolder669

# Install dependencies first
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the entire application code
COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]
