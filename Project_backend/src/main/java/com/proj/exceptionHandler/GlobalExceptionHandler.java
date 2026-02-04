package com.proj.exceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.proj.customeException.DuplicateResourceException;
import com.proj.customeException.NotFoundException;
import com.proj.dto.DeptRequestDTO;
import com.proj.dto.DeptResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<?> handleNotFoundException(NotFoundException e) {
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new DeptResponseDTO(e.getMessage(), "Failed"));
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<?> handleDuplicateResourceException(DuplicateResourceException e) {
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new DeptResponseDTO(e.getMessage(), "Failed"));
	}

	// Handle Bad Credentials (Login Failures)
	@ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
	public ResponseEntity<?> handleBadCredentials(
			org.springframework.security.authentication.BadCredentialsException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new DeptResponseDTO("Invalid email or password", "failed"));
	}

	// 500
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
		e.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new DeptResponseDTO(e.getMessage(), "failed"));
	}

	// invalidArgs
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new DeptResponseDTO(e.getMessage(), "failed"));

	}

}
