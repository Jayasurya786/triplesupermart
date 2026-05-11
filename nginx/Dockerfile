FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
