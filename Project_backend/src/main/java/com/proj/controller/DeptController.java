package com.proj.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.DeptRequestDTO;
import com.proj.dto.DeptResponseDTO;
import com.proj.entity.Department;
import com.proj.service.DepartmentService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/department")
@AllArgsConstructor

public class DeptController {
	
	private final DepartmentService departmentService;
	
	@PostMapping
	public ResponseEntity<?> addDepartment(@RequestBody DeptRequestDTO deptDTO){
		
		try {
			
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(departmentService.addDepartment(deptDTO));
				
		}
		catch(RuntimeException e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
	
	@GetMapping("allDepartments")
	public ResponseEntity<?> GetAllDepartments(){
		try {
			List<Department> list = departmentService.getAllDepartments();
			return ResponseEntity.ok(list);
			
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
	
	@GetMapping("/id/{deptId}")
	public ResponseEntity<?> GetDepartmentsByID(@PathVariable Long deptId ){
		try {
		List<Department> list = departmentService.getDepartmentById(deptId);
		return ResponseEntity.ok(list);
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}	
	}
	
	@DeleteMapping("/delete/{deptId}")
	public ResponseEntity<?> DeleteDepartmentById(@PathVariable Long deptId){
		
		
		try {
			DeptResponseDTO dto = departmentService.deleteDepartmentById(deptId); 
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Department Deleted Successfully");
			}
			catch(RuntimeException e) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
			}	
		
	}
	
	@PutMapping("/{deptId}")
	public ResponseEntity<?> updateDepartment(@PathVariable Long deptId, @RequestBody DeptRequestDTO deptDto)
	{
		
		try {
			DeptResponseDTO dto = departmentService.updateDepartment(deptId,deptDto);
			
			return ResponseEntity.ok(dto);
			
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}	
		
		
	}
	
	
	
	
}
