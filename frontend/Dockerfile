FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . /app
ENV REACT_APP_BACKEND_HOST=127.0.0.1
ENV REACT_APP_BACKEND_PORT=7700
RUN npm install
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
