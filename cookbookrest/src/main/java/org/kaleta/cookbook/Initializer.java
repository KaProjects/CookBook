package org.kaleta.cookbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
//@ComponentScan
public class Initializer extends SpringBootServletInitializer {

//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
//        return application.sources(Initializer.class);
//    }



    public static void main(String[] args) {
        SpringApplication.run(Initializer.class, args);
    }


//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurerAdapter() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**");
//            }
//        };
//    }

}
