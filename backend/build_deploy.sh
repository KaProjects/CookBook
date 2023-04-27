
# TODO fix tests
mvn clean install -DskipTests=True

docker build -t cookbook-backend:v1.1 .
docker run -d -p 7700:7777 cookbook-backend:v1.1