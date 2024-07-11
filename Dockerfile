




FROM maven:3.9.8-eclipse-temurin-22 AS build
COPY . .
RUN mvn clean package -DskipTests


FROM openjdk:22
COPY --from=build /app/target/EventEase-0.0.1-SNAPSHOT.jar EventEaseApp.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","EventEaseApp.jar"]

