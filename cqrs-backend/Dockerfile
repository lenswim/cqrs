# ---- Stage 1: Build ----
FROM gradle:8.10.2-jdk21-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle build --no-daemon

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/build/libs/cqrs-0.0.1-SNAPSHOT.jar app.jar

# Set environment variables for Render
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
