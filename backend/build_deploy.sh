# decrypt or create app.props

# TODO fix tests
mvn clean install -DskipTests=True

docker build -t cookbook-backend:v1.0 .
docker run -d cookbook-backend:v1.0