# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
