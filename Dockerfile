FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN npm install pnpm -g

COPY package.json pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm build


FROM node:20-alpine 

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install pnpm -g 

EXPOSE 80

CMD ["pnpm","run","dev"]
