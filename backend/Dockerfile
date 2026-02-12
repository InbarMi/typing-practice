FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# copy source and build
COPY . .
RUN ./mvnw clean package -DskipTests

# copy built jar and run
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]