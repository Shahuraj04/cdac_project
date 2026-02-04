package com.proj.service;

import com.proj.dto.LeaveApplyRequestDTO;
import com.proj.dto.LeaveResponseDTO;
import com.proj.entity.LeaveStatus;

public interface LeaveService {

    LeaveResponseDTO applyLeave(LeaveApplyRequestDTO dto);

    LeaveResponseDTO updateLeaveStatus(
            Long leaveId,
            LeaveStatus status,
            Long hrId);

    long leavecount();

    long approvedleavecount(LeaveStatus status);

    java.util.List<LeaveResponseDTO> getLeavesByStatus(LeaveStatus status);

    java.util.List<LeaveResponseDTO> getLeavesByDepartment(Long deptId);

    java.util.List<LeaveResponseDTO> getLeavesByHr(Long hrId, LeaveStatus status);

    java.util.List<LeaveResponseDTO> getLeavesByEmployee(Long empId);
}
