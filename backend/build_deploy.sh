# decrypt or create app.props

# TODO fix tests
mvn clean install -DskipTests=True

docker build -t cookbook-backend:v1.0 .
docker run -p 7777:7777 cookbook-backend:v1.0