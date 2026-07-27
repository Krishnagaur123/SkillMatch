#Build
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

#Runtime
FROM eclipse-temurin:21-jre

LABEL org.opencontainers.image.title="SkillMatch"
LABEL org.opencontainers.image.description="Career Opportunity Intelligence Platform"

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

RUN useradd -r -u 1001 spring
USER spring

EXPOSE 8080

ENTRYPOINT ["java","-XX:+UseContainerSupport","-jar","app.jar"]