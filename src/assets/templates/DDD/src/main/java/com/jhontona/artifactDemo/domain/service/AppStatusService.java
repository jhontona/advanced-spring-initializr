package {{group}}.{{artifact}}.domain.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class AppStatusService {

    private Logger logger = LoggerFactory.getLogger(AppStatusService.class);

    public HashMap<String, Boolean> getConnectionStatus() {
        HashMap<String, Boolean> connectionStatus = new HashMap<>();
        try {
            //Llame al método del repositorio que trae el estado de la BD
            connectionStatus.put("mi_conexion", Boolean.FALSE);
        } catch (Exception e) {
            logger.error(String.format("Error getConnectionStatus: %s", e.getMessage()));
        }
        return connectionStatus;
    }
}