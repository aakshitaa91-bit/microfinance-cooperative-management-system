package com.cooperative.config;

import org.neo4j.driver.AuthToken;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Neo4j Configuration for DA3 Graph Database.
 * Configures a singleton Driver bean with connection pooling.
 * Destroys and closes the driver connection pool cleanly on Spring shutdown.
 */
@Configuration
public class Neo4jConfig {

    @Value("${neo4j.uri:bolt://localhost:7687}")
    private String uri;

    @Value("${neo4j.username:}")
    private String username;

    @Value("${neo4j.password:}")
    private String password;

    @Bean(destroyMethod = "close")
    public Driver neo4jDriver() {
        AuthToken authToken;
        if (username != null && !username.trim().isEmpty() && password != null) {
            authToken = AuthTokens.basic(username.trim(), password);
        } else {
            authToken = AuthTokens.none();
        }
        return GraphDatabase.driver(uri, authToken);
    }
}
