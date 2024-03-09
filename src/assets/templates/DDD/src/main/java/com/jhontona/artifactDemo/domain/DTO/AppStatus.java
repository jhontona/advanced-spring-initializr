package {{group}}.{{artifact}}.domain.DTO;

import lombok.Data;

import java.util.HashMap;

@Data
public class AppStatus {
    private HashMap<String, Boolean> connectionStatus;
    private String version;
}