package com.proj.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveApplyRequestDTO {

    private Long empId;
    private String leaveCategory;   // SICK, CASUAL, ANNUAL, WFH, UNPAID, etc.
    private String leaveSubCategory;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
}
