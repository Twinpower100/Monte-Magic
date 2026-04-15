# mirror.gcr.io — если docker.io с IP даёт 403 (см. README / деплой в РФ)
FROM mirror.gcr.io/library/node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
# Payload 3.81 + next@15.5.x: peer range mismatch; локально lock мог собираться иначе
RUN npm install --legacy-peer-deps

COPY . .

# NEXT_PUBLIC_* подставляется в клиентский бандл на этапе build — задайте через compose build.args
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3006
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NODE_ENV=production

RUN mkdir -p /app/media

RUN npm run build

EXPOSE 3006

CMD ["npm", "start"]
