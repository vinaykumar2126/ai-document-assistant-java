package com.example.ai_powered_document.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Bean;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer(){
        //Configure CORS settings registers CORS rules
        //WebMvcConfigurer interface provides callback methods to customize the Java-based configuration.
        //WebMvcConfigurer is a speacial interface with default methods to allow overrides which can help to implement single methods
        return new WebMvcConfigurer() {  
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Cors Registry is Spring's CORS configuration builder. 
                registry.addMapping("/**") // Apply CORS rules to all endpoints
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true) // Allow credentials such as cookies and authorization headers
                        .maxAge(3600); // Cache pre-flight response for 1 hour
            }
        };
    }
}
