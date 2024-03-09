package {{group}}.{{artifact}}.web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Value("${spring.application.version}")
    private String VERSION;

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("{{group}}.{{artifact}}.web.controller"))
                .build();
    }

    private ApiInfo apiInfo(){
        return new ApiInfo(
                {{artifactC}},
                {{description}},
                VERSION,
                "{{use_term}}",
                new Contact("{{contact}}", "{{web}}", "{{email}}"),
                "{{license}}",
                "{{policy}}",
                Collections.emptyList()
        );
    }
}