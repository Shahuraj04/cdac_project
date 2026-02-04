package com.proj.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proj.dto.LeaveApplyRequestDTO;
import com.proj.dto.LeaveResponseDTO;
import com.proj.entity.LeaveRequest;
import com.proj.entity.LeaveStatus;
import com.proj.repository.EmpRepository;
import com.proj.repository.HrRepository;
import com.proj.repository.LeaveRepository;
import com.proj.repository.AttendanceRepository;
import com.proj.entity.Attendance;
import com.proj.entity.AttendanceStatus;
import com.proj.entity.Hr;
import java.time.LocalDate;

@Service
public class LeaveServiceImpl implements LeaveService {

        @Autowired
        private LeaveRepository leaveRepository;

        @Autowired
        private EmpRepository employeeRepository;

        @Autowired
        private HrRepository hrRepository;

        @Autowired
        private AttendanceRepository attendanceRepository;

        @Autowired
        private ModelMapper modelMapper;

        @Override
        public LeaveResponseDTO applyLeave(LeaveApplyRequestDTO dto) {

                LeaveRequest leave = new LeaveRequest();
                leave.setStartDate(dto.getStartDate());
                leave.setEndDate(dto.getEndDate());
                leave.setReason(dto.getReason());
                leave.setLeaveCategory(dto.getLeaveCategory());
                leave.setLeaveSubCategory(dto.getLeaveSubCategory());
                leave.setStatus(LeaveStatus.PENDING);

                leave.setEmployee(
                                employeeRepository.findById(dto.getEmpId())
                                                .orElseThrow(() -> new RuntimeException("Employee not found")));

                LeaveRequest saved = leaveRepository.save(leave);

                LeaveResponseDTO response = modelMapper.map(saved, LeaveResponseDTO.class);
                response.setEmpName(saved.getEmployee().getEmp_name());
                response.setEmpId(saved.getEmployee().getEmpId());
                response.setLeaveCategory(saved.getLeaveCategory());
                response.setLeaveSubCategory(saved.getLeaveSubCategory());
                return response;
        }

        @Override
        public LeaveResponseDTO updateLeaveStatus(
                        Long leaveId,
                        LeaveStatus status,
                        Long hrId) {

                LeaveRequest leave = leaveRepository.findById(leaveId)
                                .orElseThrow(() -> new RuntimeException("Leave not found"));

                if (leave.getStatus() != LeaveStatus.PENDING) {
                        throw new RuntimeException("Leave already processed");
                }

                leave.setStatus(status);
                Hr approvedBy = hrRepository.findById(hrId)
                                .orElseThrow(() -> new RuntimeException("HR not found"));
                leave.setHr(approvedBy);

                // Logical Link: Mark attendance as LEAVE for the dates if approved
                if (status == LeaveStatus.APPROVED) {
                        LocalDate start = leave.getStartDate();
                        LocalDate end = leave.getEndDate();

                        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                                // Check if attendance already exists for this date
                                boolean alreadyMarked = attendanceRepository
                                                .existsByEmployee_EmpIdAndAttendanceDate(leave.getEmployee().getEmpId(),
                                                                date);
                                if (!alreadyMarked) {
                                        Attendance att = new Attendance();
                                        att.setAttendanceDate(date);
                                        att.setEmployee(leave.getEmployee());
                                        att.setStatus(AttendanceStatus.LEAVE);
                                        att.setHr(approvedBy);
                                        attendanceRepository.save(att);
                                }
                        }
                }

                LeaveRequest updated = leaveRepository.save(leave);

                LeaveResponseDTO response = modelMapper.map(updated, LeaveResponseDTO.class);

                response.setEmpName(updated.getEmployee().getEmp_name());

                return response;
        }

        @Override
        public long leavecount() {

                return leaveRepository.findByStatus(LeaveStatus.PENDING).size();
        }

        @Override
        public long approvedleavecount(LeaveStatus leaveStatus) {

                return leaveRepository.findByStatus(leaveStatus).size();
        }

        @Override
        public java.util.List<LeaveResponseDTO> getLeavesByStatus(LeaveStatus status) {
                return leaveRepository.findByStatus(status)
                                .stream()
                                .map(leave -> {
                                        LeaveResponseDTO dto = modelMapper.map(leave, LeaveResponseDTO.class);
                                        dto.setEmpName(leave.getEmployee().getEmp_name());
                                        return dto;
                                })
                                .toList();
        }

        @Override
        public java.util.List<LeaveResponseDTO> getLeavesByDepartment(Long deptId) {
                return leaveRepository.findByEmployee_Department_DeptId(deptId)
                                .stream()
                                .map(leave -> {
                                        LeaveResponseDTO dto = modelMapper.map(leave, LeaveResponseDTO.class);
                                        dto.setEmpName(leave.getEmployee().getEmp_name());
                                        return dto;
                                })
                                .toList();
        }

        @Override
        public java.util.List<LeaveResponseDTO> getLeavesByHr(Long hrId, LeaveStatus status) {
                return leaveRepository.findByEmployee_Hr_HrIdAndStatus(hrId, status)
                                .stream()
                                .map(leave -> {
                                        LeaveResponseDTO dto = modelMapper.map(leave, LeaveResponseDTO.class);
                                        dto.setEmpName(leave.getEmployee().getEmp_name());
                                        return dto;
                                })
                                .toList();
        }

        @Override
        public java.util.List<LeaveResponseDTO> getLeavesByEmployee(Long empId) {
                return leaveRepository.findByEmployee_EmpId(empId)
                                .stream()
                                .map(leave -> {
                                        LeaveResponseDTO dto = modelMapper.map(leave, LeaveResponseDTO.class);
                                        dto.setEmpName(leave.getEmployee().getEmp_name());
                                        dto.setEmpId(leave.getEmployee().getEmpId());
                                        dto.setLeaveCategory(leave.getLeaveCategory());
                                        dto.setLeaveSubCategory(leave.getLeaveSubCategory());
                                        return dto;
                                })
                                .toList();
        }
}
