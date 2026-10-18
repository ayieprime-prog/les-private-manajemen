FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend backend
COPY frontend frontend

RUN npm --prefix backend install

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
