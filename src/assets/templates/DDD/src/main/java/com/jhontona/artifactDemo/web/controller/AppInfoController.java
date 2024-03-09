package {{group}}.{{artifact}}.web.controller;

import {{group}}.{{artifact}}.domain.DTO.AppStatus;
import {{group}}.{{artifact}}.domain.service.AppStatusService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/app_info")
@Api(tags = {"Información"})
public class AppInfoController {
    private Logger logger = LoggerFactory.getLogger(AppInfoController.class);

    @Value("${spring.application.version}")
    private String VERSION;

    @Autowired
    private AppStatusService appStatusService;

    @GetMapping("/appStatus")
    @ApiOperation("Devuelve el estado de las conexiones y la versión")
    @ApiResponses({
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 500, message = "Error interno")
    })
    public ResponseEntity<AppStatus> checkStatus() {
        AppStatus status = new AppStatus();
        try {
            status.setVersion(VERSION);
            status.setConnectionStatus(appStatusService.getConnectionStatus());
            return new ResponseEntity<>(status, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}