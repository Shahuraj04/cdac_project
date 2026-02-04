package com.proj.service;

import java.util.List;

import com.proj.dto.DeptResponseDTO;
import com.proj.dto.EmpRequestDTO;
import com.proj.entity.Employee;

public interface EmployeeService {

    DeptResponseDTO addEmployee(EmpRequestDTO empDTO);

    List<Employee> getAllEmployees();

    List<Employee> getEmployeeById(Long empId);

    DeptResponseDTO deleteEmployeeById(Long empId);

    DeptResponseDTO updateEmployee(Long empId, EmpRequestDTO empDto);

    long getEmployeeCount();

    List<Employee> getEmployeesByDepartment(Long deptId);

    List<Employee> getEmployeesByHr(Long hrId);

    Employee getEmployeeByUserId(Long userId);

    Employee getEmployeeByEmail(String email);

    DeptResponseDTO reactivateEmployee(Long empId);

    java.util.List<com.proj.dto.EmployeePerformanceDTO> getPerformanceMetrics(Long empId, int months);
}
