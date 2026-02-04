package com.proj.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmpRequestDTO {

	@NotNull(message = "Emp_name can not be null")
	private String emp_name;

	@NotNull
	private String email;

	private String password;

	@NotNull
	private String phone;

	@NotNull
	private String designation;

	@NotNull
	private LocalDate joinDate;

	@NotNull
	private Long deptId;

	@NotNull
	private Long hrId;

}
