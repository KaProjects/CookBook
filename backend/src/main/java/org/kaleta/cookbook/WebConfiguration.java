package org.kaleta.cookbook;

import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static springfox.documentation.builders.PathSelectors.regex;

@EnableSwagger2
@Configuration
public class WebConfiguration {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
//                String rootPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
//                try (InputStream input = new FileInputStream(rootPath + "application.properties")) {
//                    Properties prop = new Properties();
//                    prop.load(input);
//                    if (prop.getProperty("server.host") != null) {
//                        registry.addMapping("/**").allowedOrigins(prop.getProperty("server.host"));
//                    }
//                } catch (IOException ex) {
//                    ex.printStackTrace();
//                }
                // TODO: 1.2.2022 temp dev
                registry.addMapping("/**").allowedOrigins("*");
            }
        };
    }

    @Bean
    public Mapper dozer() {
        return new DozerBeanMapper();
    }

    @Bean
    public Docket productApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("org.kaleta.cookbook.rest"))
                .paths(regex("/.*"))
                .build();
    }

}
