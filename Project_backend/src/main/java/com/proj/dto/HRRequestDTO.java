package com.proj.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class HRRequestDTO {

	@NotNull(message = "Name can not be null")
	private String hr_name;

	@NotNull(message = "Name can not be null")
	private String email;

	private String password;

	@NotNull(message = "Name can not be null")
	private String phone;

	private Long deptId;

}
