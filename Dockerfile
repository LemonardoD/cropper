FROM node:18

WORKDIR /app

COPY "package.json" /app
COPY "tsconfig.json" /app
# Installs all packages

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN npm install
COPY ./ ./

CMD ["npm", "run", "deploy"]
