package com.proj.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.customeException.NotFoundException;
import com.proj.dto.DeptResponseDTO;
import com.proj.dto.HRRequestDTO;
import com.proj.entity.Department;
import com.proj.entity.Hr;
import com.proj.entity.Role;
import com.proj.entity.User;
import com.proj.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.proj.repository.DeptRepository;
import com.proj.repository.HrRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
@Transactional

public class HrServiceImpl implements HrService {

	private final ModelMapper mapper;

	private final HrRepository hrRepository;

	private final DeptRepository deptrepo;

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public List<Hr> getAllHr() {
		List<Hr> hr = hrRepository.findAll();

		if (hr.isEmpty()) {
			throw new NotFoundException("Hr not found");
		}

		return hr;
	}

	@Override
	public List<Hr> getByHrId(Long hrId) {
		List<Hr> hr = hrRepository.findByHrId(hrId);

		if (hr.isEmpty()) {
			throw new NotFoundException("Hr not found");
		}

		return hr;
	}

	@Override
	public DeptResponseDTO addHR(HRRequestDTO hrRequestDTO) {

		Department department = deptrepo.findById(hrRequestDTO.getDeptId())
				.orElseThrow(() -> new NotFoundException("Department not found"));

		// Create and save User first
		User user = new User();
		user.setEmail(hrRequestDTO.getEmail());
		user.setPassword(passwordEncoder.encode(hrRequestDTO.getPassword()));
		user.setRole(Role.ROLE_HR);
		user = userRepository.save(user);

		Hr hr = new Hr();
		hr.setHr_name(hrRequestDTO.getHr_name());
		hr.setUser(user);
		hr.setPhone(hrRequestDTO.getPhone());
		hr.setDepartment(department);

		Hr save = hrRepository.save(hr);

		return new DeptResponseDTO(
				"Hr Added " + save.getHrId(),
				"Successfully");
	}

	@Override
	public DeptResponseDTO deleteHrById(Long hrId) {
		Hr hr = hrRepository.findById(hrId).orElseThrow(() -> new RuntimeException("resource not found"));

		hrRepository.delete(hr);

		return new DeptResponseDTO("Department Deleted" + hr.getHrId(), "successful");

	}

	@Override
	public DeptResponseDTO updateHr(Long hrId, HRRequestDTO hrDto) {

		Hr hr = hrRepository.findById(hrId)
				.orElseThrow(() -> new RuntimeException("Resource Not Found"));

		Department department = deptrepo.findById(hrDto.getDeptId())
				.orElseThrow(() -> new NotFoundException("Data not Found"));

		hr.setHr_name(hrDto.getHr_name());

		// Update user details
		User user = hr.getUser();
		user.setEmail(hrDto.getEmail());
		if (hrDto.getPassword() != null && !hrDto.getPassword().isEmpty()) {
			user.setPassword(passwordEncoder.encode(hrDto.getPassword()));
		}
		userRepository.save(user);

		hr.setPhone(hrDto.getPhone());
		hr.setDepartment(department);

		Hr updatedHr = hrRepository.save(hr);

		return new DeptResponseDTO(
				"HR Updated " + updatedHr.getHrId(),
				"Successfully");
	}

	@Override
	public Hr getHrByUserId(Long userId) {
		return hrRepository.findByUser_Id(userId)
				.orElseThrow(() -> new NotFoundException("HR not found for user ID: " + userId));
	}

	@Override
	public Hr findHrByEmail(String email) {
		return hrRepository.findByUser_Email(email)
				.orElseThrow(() -> new NotFoundException("HR not found for email: " + email));
	}
}
