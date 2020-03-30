package org.kaleta.cookbook;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Configuration
public class WebConfiguration {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String rootPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
                try (InputStream input = new FileInputStream(rootPath + "application.properties")) {
                    Properties prop = new Properties();
                    prop.load(input);
                    if (prop.getProperty("server.host") != null) {
                        registry.addMapping("/**").allowedOrigins(prop.getProperty("server.host"));
                    }
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        };
    }
}
