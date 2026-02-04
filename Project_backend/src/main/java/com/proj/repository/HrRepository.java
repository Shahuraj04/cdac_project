package com.proj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proj.entity.Hr;

public interface HrRepository extends JpaRepository<Hr, Long> {

	List<Hr> findByHrId(Long hrId);

	java.util.Optional<Hr> findByUser_Id(Long userId);

	java.util.Optional<Hr> findByUser_Email(String email);

}
