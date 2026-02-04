package com.proj.service;

import java.util.List;

import javax.management.RuntimeErrorException;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.customeException.NotFoundException;
import com.proj.dto.DeptRequestDTO;
import com.proj.dto.DeptResponseDTO;
import com.proj.entity.Department;
import com.proj.repository.DeptRepository;

import io.swagger.v3.oas.models.responses.ApiResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
	
	private final DeptRepository deptRepository;
	private final ModelMapper modelMapper;
	

	@Override
	public DeptResponseDTO addDepartment(DeptRequestDTO deptDTO) {
		
		
		
		Department department = modelMapper.map(deptDTO, Department.class);
		
		Department save = deptRepository.save(department);
		
		return new DeptResponseDTO("Department added with id"+ save.getDeptId(), "success");
		
		
	}


	@Override
	public List<Department> getAllDepartments() {
		List<Department> list= deptRepository.findAll();
		
		if(list.isEmpty()) {
			throw new NotFoundException("No department is present");
		}
		return list;
	}


	@Override
	public List<Department> getDepartmentById(Long deptId) {
		List<Department> lst = deptRepository.findByDeptId(deptId);
		
		if(lst.isEmpty()) {
			throw new NotFoundException("No department is present");
		}
		
		return lst;
	}


	@Override
	public DeptResponseDTO deleteDepartmentById(Long deptId) {
		Department lst = deptRepository.findById(deptId).orElseThrow(()-> new RuntimeException("resource not found"));
		
		deptRepository.delete(lst);
		return new DeptResponseDTO("Department Deleted"+ lst.getDeptId(), "successful");
		
	}


	@Override
	public DeptResponseDTO updateDepartment(Long deptId, DeptRequestDTO deptDto) {
		Department dept = deptRepository.findById(deptId).orElseThrow(()-> new RuntimeException("Resource Not Found"));
		
		dept.setDept_name(deptDto.getDept_name());
		dept.setDept_code(deptDto.getDept_code());
		dept.setDept_description(deptDto.getDept_description());
		
		Department updateDept = deptRepository.save(dept);
		
		
		
		return new DeptResponseDTO("Department Updated" + updateDept.getDeptId(), " Successfully");
	}

}
