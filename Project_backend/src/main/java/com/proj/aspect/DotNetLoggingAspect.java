package com.proj.aspect;

import com.proj.annotation.DotNetLog;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Aspect  
@Component  
public class DotNetLoggingAspect {

    private final RestTemplate restTemplate = new RestTemplate();
    
    private final String DOTNET_API_URL = "http://localhost:5155/api/logs";

    @AfterReturning(pointcut = "@annotation(dotNetLog)", returning = "result")
    public void logAfterMethod(JoinPoint joinPoint, DotNetLog dotNetLog, Object result) {
        try {
            // 1. Get the method name
            String methodName = joinPoint.getSignature().getName();
            
            // 2. Get the custom message from the annotation
            String customInfo = dotNetLog.value();
            
            // 3. Build the final string to send to the .NET FileLogger
            String finalLog = String.format("Method [%s] executed. Info: %s", methodName, customInfo);

            // 4. Send it to the .NET API
            // We send a Map because the .NET Controller expects a JSON object with a "message" key
            restTemplate.postForObject(DOTNET_API_URL, Map.of("message", finalLog), String.class);
            
            System.out.println(">>> Successfully sent log to .NET: " + finalLog);
        } catch (Exception e) {
            System.err.println(">>> Failed to contact .NET Logger: " + e.getMessage());
        }
    }
}