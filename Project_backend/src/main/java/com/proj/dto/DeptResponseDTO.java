package com.proj.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DeptResponseDTO {
	
	private String message ;
	
	private String status;
	
	private LocalDateTime timesStampDiff;
	
	public DeptResponseDTO(String message, String status) {
		super();
		this.message = message;
		this.status = status;
		this.timesStampDiff=LocalDateTime.now();
	}

	

}
