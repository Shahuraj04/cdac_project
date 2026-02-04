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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.DeptRequestDTO;
import com.proj.dto.DeptResponseDTO;
import com.proj.dto.EmpRequestDTO;
import com.proj.dto.EmployeePerformanceDTO;
import com.proj.entity.Department;
import com.proj.entity.Employee;
import com.proj.service.EmployeeService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/employee")
@AllArgsConstructor

public class EmpController {

	private final EmployeeService employeeService;

	@PostMapping("/addemployee")
	public ResponseEntity<?> addEmployee(@RequestBody EmpRequestDTO deptDTO) {

		try {

			return ResponseEntity.status(HttpStatus.CREATED)
					.body(employeeService.addEmployee(deptDTO));

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("allEmployees")
	public ResponseEntity<?> GetAllEmployees() {
		try {
			List<Employee> list = employeeService.getAllEmployees();
			return ResponseEntity.ok(list);

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/id/{empId}")
	public ResponseEntity<?> GetEmployeeByID(@PathVariable Long empId) {
		try {
			List<Employee> list = employeeService.getEmployeeById(empId);
			return ResponseEntity.ok(list);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{empId}")
	public ResponseEntity<?> DeleteEmployeeById(@PathVariable Long empId) {

		try {
			DeptResponseDTO dto = employeeService.deleteEmployeeById(empId);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Employee Deleted Successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}

	}

	@PutMapping("/{empId}")
	public ResponseEntity<?> updateDepartment(@PathVariable Long empId, @RequestBody EmpRequestDTO empDto) {
		try {
			DeptResponseDTO dto = employeeService.updateEmployee(empId, empDto);
			return ResponseEntity.ok(dto);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/count")
	public ResponseEntity<?> getEmployeeCount() {
		return ResponseEntity.ok(employeeService.getEmployeeCount());
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> GetEmployeeByUserId(@PathVariable Long userId) {
		try {
			Employee emp = employeeService.getEmployeeByUserId(userId);
			return ResponseEntity.ok(emp);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/email/{email}")
	public ResponseEntity<?> GetEmployeeByEmail(@PathVariable String email) {
		try {
			Employee emp = employeeService.getEmployeeByEmail(email);
			return ResponseEntity.ok(emp);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PutMapping("/{empId}/reactivate")
	public ResponseEntity<?> reactivateEmployee(@PathVariable Long empId) {
		try {
			DeptResponseDTO dto = employeeService.reactivateEmployee(empId);
			return ResponseEntity.ok(dto);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/{empId}/performance")
	public ResponseEntity<List<EmployeePerformanceDTO>> getPerformance(
			@PathVariable Long empId,
			@RequestParam(value = "months", defaultValue = "6") int months) {
		try {
			List<EmployeePerformanceDTO> metrics = employeeService.getPerformanceMetrics(empId, months);
			return ResponseEntity.ok(metrics);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
