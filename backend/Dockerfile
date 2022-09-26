FROM java:8  
COPY ./target/ /var/cookbook/
WORKDIR /var/cookbook/
ENV DB_HOST=172.17.0.1
CMD ["java", "-jar", "/var/cookbook/cookbook-1.1.jar"]

