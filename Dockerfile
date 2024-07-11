# First stage: build the application
FROM maven:3.8.5-openjdk-22 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and the source code into the container
COPY pom.xml .
COPY src ./src

# Run the Maven build
RUN mvn clean install

# Second stage: run the application
FROM openjdk:22-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file from the build stage
COPY --from=build /app/target/EventEase-0.0.1-SNAPSHOT.jar EventEaseApp.jar

# Expose the port that your application will run on
EXPOSE 8080

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "EventEaseApp.jar"]
