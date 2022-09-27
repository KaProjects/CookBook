docker build -t cookbook-frontend:v1.1 .

docker run -d -p 3777:3000 \
    -v ${pwd}:/app \
    -v /app/node_modules \
    -e CHOKIDAR_USEPOLLING=true \
    cookbook-frontend:v1.1
