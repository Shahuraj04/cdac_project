package com.proj.service;

import java.time.LocalDate;
import java.util.List;

import com.proj.dto.TeamSummaryDTO;
import com.proj.dto.TimesheetRowDTO;

public interface TimesheetService {

    List<TimesheetRowDTO> getEmployeeTimesheet(Long empId, LocalDate startDate, LocalDate endDate, String statusFilter);

    List<TimesheetRowDTO> getTeamTimesheet(Long hrId, LocalDate startDate, LocalDate endDate, String statusFilter, Long empIdFilter);

    TeamSummaryDTO getTeamSummary(Long hrId, LocalDate date);

    /**
     * Company-wide timesheet for admins (all employees, any HR).
     */
    List<TimesheetRowDTO> getCompanyTimesheet(LocalDate startDate, LocalDate endDate, String statusFilter, Long empIdFilter);
}

