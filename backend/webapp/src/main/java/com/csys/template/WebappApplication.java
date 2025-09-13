package com.csys.template;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class WebappApplication {

    private static final Logger logger = LoggerFactory.getLogger(WebappApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WebappApplication.class, args);
    }

    // JWT secret is now generated directly in JwtUtil - no need for complex property injection
}