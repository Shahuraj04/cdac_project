package com.proj.dto;
import java.time.LocalDate;

import com.proj.entity.LeaveStatus;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LeaveResponseDTO {
    private Long leaveId;
    private String leaveCategory;
    private String leaveSubCategory;
    private LocalDate startDate;
    private LocalDate endDate;
    private LeaveStatus status;
    private String empName;
    private Long empId;
}
