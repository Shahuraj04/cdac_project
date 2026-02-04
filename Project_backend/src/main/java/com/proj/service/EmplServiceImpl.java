package com.proj.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.customeException.NotFoundException;
import com.proj.dto.DeptResponseDTO;
import com.proj.dto.EmployeePerformanceDTO;
import com.proj.dto.EmpRequestDTO;
import com.proj.entity.Attendance;
import com.proj.entity.AttendanceStatus;
import com.proj.entity.Department;
import com.proj.entity.Employee;
import com.proj.entity.Hr;
import com.proj.repository.AttendanceRepository;
import com.proj.repository.DeptRepository;
import com.proj.repository.EmpRepository;
import com.proj.repository.HrRepository;
import com.proj.entity.Role;
import com.proj.entity.User;
import com.proj.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
@Transactional
public class EmplServiceImpl implements EmployeeService {

    private final EmpRepository empRepository;
    private final DeptRepository deptRepository;
    private final HrRepository hrRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;

    @Override
    public DeptResponseDTO addEmployee(EmpRequestDTO empDTO) {

        if (empDTO.getDeptId() == null)
            throw new IllegalArgumentException("Dept ID is required");
        Department dept = deptRepository.findById(empDTO.getDeptId())
                .orElseThrow(() -> new NotFoundException("Department not found"));

        if (empDTO.getHrId() == null)
            throw new IllegalArgumentException("HR ID is required");
        Hr hr = hrRepository.findById(empDTO.getHrId())
                .orElseThrow(() -> new NotFoundException("HR not found"));

        if (userRepository.existsByEmail(empDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create and save User first
        User user = new User();
        user.setEmail(empDTO.getEmail());
        user.setPassword(passwordEncoder.encode(empDTO.getPassword()));
        user.setRole(Role.ROLE_EMPLOYEE);
        user = userRepository.save(user);

        Employee emp = new Employee();
        emp.setEmp_name(empDTO.getEmp_name());
        emp.setUser(user);
        emp.setPhone(empDTO.getPhone());
        emp.setDesignation(empDTO.getDesignation());
        emp.setJoinDate(empDTO.getJoinDate());
        emp.setDepartment(dept);
        emp.setHr(hr);

        Employee saved = empRepository.save(emp);

        return new DeptResponseDTO(
                "Employee Added " + saved.getEmpId(),
                "Successfully");
    }

    @Override
    public List<Employee> getAllEmployees() {
        List<Employee> list = empRepository.findAll();

        if (list.isEmpty()) {
            throw new NotFoundException("No employees found");
        }
        return list;
    }

    @Override
    public List<Employee> getEmployeeById(Long empId) {
        List<Employee> list = empRepository.findByEmpId(empId);

        if (list.isEmpty()) {
            throw new NotFoundException("Employee not found");
        }
        return list;
    }

    @Override
    public DeptResponseDTO deleteEmployeeById(Long empId) {

        Employee emp = empRepository.findById(empId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        // Soft delete happens here
        empRepository.delete(emp);

        return new DeptResponseDTO(
                "Employee Deleted " + emp.getEmpId(),
                "Successful");
    }

    @Override
    public DeptResponseDTO updateEmployee(Long empId, EmpRequestDTO empDto) {

        Employee emp = empRepository.findById(empId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        emp.setEmp_name(empDto.getEmp_name());

        // Update user details
        User user = emp.getUser();
        user.setEmail(empDto.getEmail());
        if (empDto.getPassword() != null && !empDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(empDto.getPassword()));
        }
        userRepository.save(user);

        emp.setPhone(empDto.getPhone());
        emp.setDesignation(empDto.getDesignation());
        emp.setJoinDate(empDto.getJoinDate());

        Employee updated = empRepository.save(emp);

        return new DeptResponseDTO(
                "Employee Updated " + updated.getEmpId(),
                "Successfully");
    }

    @Override
    public long getEmployeeCount() {
        return empRepository.count();
    }

    @Override
    public List<Employee> getEmployeesByDepartment(Long deptId) {
        return empRepository.findByDepartment_DeptId(deptId);
    }

    @Override
    public List<Employee> getEmployeesByHr(Long hrId) {
        return empRepository.findByHr_HrId(hrId);
    }

    @Override
    public Employee getEmployeeByUserId(Long userId) {
        return empRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found for user id: " + userId));
    }

    @Override
    public Employee getEmployeeByEmail(String email) {
        return empRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Employee not found for email: " + email));
    }

    @Override
    @Transactional
    public DeptResponseDTO reactivateEmployee(Long empId) {
        int updated = empRepository.reactivateByEmpId(empId);
        if (updated == 0) {
            throw new NotFoundException("Employee not found or already active");
        }
        return new DeptResponseDTO("Employee Reactivated " + empId, "Successfully");
    }

    @Override
    public List<EmployeePerformanceDTO> getPerformanceMetrics(Long empId, int months) {
        empRepository.findById(empId).orElseThrow(() -> new NotFoundException("Employee not found"));
        LocalDate start = LocalDate.now().minusMonths(months);
        List<Attendance> records = attendanceRepository.findByEmployee_EmpIdAndAttendanceDateBetween(empId, start, LocalDate.now());

        Map<YearMonth, List<Attendance>> byMonth = records.stream()
                .collect(Collectors.groupingBy(a -> YearMonth.from(a.getAttendanceDate())));

        List<EmployeePerformanceDTO> result = new ArrayList<>();
        for (int i = months - 1; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            List<Attendance> list = byMonth.getOrDefault(ym, List.of());
            long onTime = list.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
            long late = list.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
            long wfh = list.stream().filter(a -> a.getStatus() == AttendanceStatus.WORK_FROM_HOME).count();
            BigDecimal avgHours = list.stream()
                    .map(Attendance::getTotalHours)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (!list.isEmpty()) {
                avgHours = avgHours.divide(BigDecimal.valueOf(list.size()), 2, java.math.RoundingMode.HALF_UP);
            }
            result.add(new EmployeePerformanceDTO(
                    ym.toString(),
                    list.size(),
                    onTime,
                    late,
                    wfh,
                    avgHours));
        }
        return result;
    }
}
