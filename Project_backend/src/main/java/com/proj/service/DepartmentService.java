package com.proj.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proj.dto.DeptRequestDTO;
import com.proj.dto.DeptResponseDTO;
import com.proj.entity.Department;


public interface DepartmentService {

	DeptResponseDTO addDepartment(DeptRequestDTO deptDTO);

	List<Department> getAllDepartments();

	List<Department> getDepartmentById(Long deptId);

	DeptResponseDTO deleteDepartmentById(Long deptId);

	DeptResponseDTO updateDepartment(Long deptId, DeptRequestDTO deptDto);
}
