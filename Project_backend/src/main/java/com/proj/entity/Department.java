package com.proj.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Dept")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class Department {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long deptId;
	
	@Column(nullable = false)
	private String dept_name;
	
	@Column(unique = true, nullable = false)
	private String dept_code;
	
	@Column(nullable = false)
	private String dept_description;
	
	@Column(name = "manager_id")
	private Long managerId;
}

