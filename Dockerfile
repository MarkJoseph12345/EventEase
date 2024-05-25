FROM openjdk:22-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file into the container
COPY target/EventEase-0.0.1-SNAPSHOT.jar EventEaseApp.jar

# Expose the port that your application will run on
EXPOSE 8080

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "EventEaseApp.jar"]