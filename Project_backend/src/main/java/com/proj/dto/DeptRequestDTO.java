package com.proj.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeptRequestDTO {
	
	@NotBlank(message="Message can not be null")
	private String dept_name;
	
	@NotNull(message = "dept_code can not be null")
	private String dept_code;
	
	@NotBlank
	private String dept_description;
}
