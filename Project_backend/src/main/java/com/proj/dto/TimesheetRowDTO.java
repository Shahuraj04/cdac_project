package com.proj.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimesheetRowDTO {

    private Long empId;
    private String empName;

    private Long hrId;
    private String hrName;

    private LocalDate date;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;

    private BigDecimal workingHours;

    /**
     * Raw status name, e.g. PRESENT, LATE, HALF_DAY, LEAVE, WORK_FROM_HOME.
     * Frontend can map this to user-friendly labels like "On-time".
     */
    private String status;
}

