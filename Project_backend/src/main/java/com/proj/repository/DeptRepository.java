package com.proj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proj.entity.Department;

public interface DeptRepository extends JpaRepository<Department, Long> {

	List<Department> findByDeptId(Long dept_id);

	
	
}
