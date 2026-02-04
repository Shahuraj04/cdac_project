package com.proj.service;

import java.util.List;

import com.proj.dto.DeptResponseDTO;
import com.proj.dto.HRRequestDTO;
import com.proj.entity.Hr;

public interface HrService {

	List<Hr> getAllHr();

	List<Hr> getByHrId(Long hrId);

	DeptResponseDTO addHR(HRRequestDTO hrRequestDTO);

	DeptResponseDTO deleteHrById(Long hrId);

	DeptResponseDTO updateHr(Long hrId, HRRequestDTO hrDto);

	Hr getHrByUserId(Long userId);

	Hr findHrByEmail(String email);

}
