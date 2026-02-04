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

import com.proj.dto.DeptResponseDTO;
import com.proj.dto.HRRequestDTO;
import com.proj.entity.Hr;
import com.proj.service.HrService;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/Hr")
@AllArgsConstructor
public class HRController {

	private final HrService hrService;

	@GetMapping("allHr")
	public ResponseEntity<?> GetAllHr() {
		try {

			List<Hr> hr = hrService.getAllHr();
			return ResponseEntity.ok(hr);
		} catch (RuntimeException e) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		}
	}

	@GetMapping("getHrById/{hrId}")
	public ResponseEntity<?> GetHrById(@PathVariable Long hrId) {
		try {

			List<Hr> hr = hrService.getByHrId(hrId);
			return ResponseEntity.ok(hr);
		} catch (RuntimeException e) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		}
	}

	@PostMapping("addHr")
	public ResponseEntity<?> addHr(@RequestBody HRRequestDTO hrRequestDTO) {
		try {

			return ResponseEntity.status(HttpStatus.CREATED)
					.body(hrService.addHR(hrRequestDTO));

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{hrId}")
	public ResponseEntity<?> DeleteHrById(@PathVariable Long hrId) {

		try {
			DeptResponseDTO dto = hrService.deleteHrById(hrId);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Department Deleted Successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PutMapping("/{hrId}")
	public ResponseEntity<?> updateHr(@PathVariable Long hrId, @RequestBody HRRequestDTO hrDto) {

		try {
			DeptResponseDTO res = hrService.updateHr(hrId, hrDto);
			return ResponseEntity.ok(res);

		} catch (RuntimeException e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body(e.getMessage());
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> GetHrByUserId(@PathVariable Long userId) {
		try {
			Hr hr = hrService.getHrByUserId(userId);
			return ResponseEntity.ok(hr);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/email/{email}")
	public ResponseEntity<?> GetHrByEmail(@PathVariable String email) {
		try {
			Hr hr = hrService.findHrByEmail(email);
			return ResponseEntity.ok(hr);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
}
