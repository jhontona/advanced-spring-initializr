package {{group}}.{{artifact}}.web.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@Api(tags = {"{{description}}"})
public class {{artifactC}}Controller {
    private Logger logger = LoggerFactory.getLogger({{artifactC}}Controller.class);

    @Autowired
    private {{artifactC}}Service service;

    @GetMapping("/hello")
    @ApiOperation("Saluda")
    @ApiResponses({
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 500, message = "Error interno")
    })
    public ResponseEntity<AppStatus> checkStatus() {
        AppStatus status = new AppStatus();
        try {
            return new ResponseEntity<>("Hello", HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}