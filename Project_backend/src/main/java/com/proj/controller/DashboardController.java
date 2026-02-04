package com.proj.controller;

import com.proj.security.UserPrincipal;
import com.proj.service.EmployeeService;
import com.proj.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private HrService hrService;

    @GetMapping
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String role = principal.getUserRole().name();
        Map<String, Object> response = new HashMap<>();
        response.put("role", role);

        if (role.equals("ROLE_ADMIN")) {
            response.put("employees", employeeService.getAllEmployees());
            response.put("hrs", hrService.getAllHr());
        } else if (role.equals("ROLE_HR")) {
            // For HR, show direct reports (employees mapped to this HR)
            try {
                var hr = hrService.getHrByUserId(principal.getUserId());
                response.put("employees", employeeService.getEmployeesByHr(hr.getHrId()));
            } catch (Exception e) {
                response.put("employees", java.util.Collections.emptyList());
            }
        } else if (role.equals("ROLE_EMPLOYEE")) {
            try {
                response.put("profile", employeeService.getEmployeeByUserId(principal.getUserId()));
            } catch (Exception e) {
                response.put("profile", null);
            }
        }

        return ResponseEntity.ok(response);
    }
}
