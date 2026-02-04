package com.proj.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proj.entity.LeaveRequest;
import com.proj.entity.*;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    /* 🔹 Fetch all leaves of a particular employee */
    List<LeaveRequest> findByEmployee_EmpId(Long empId);

    /* 🔹 Fetch leaves by status (PENDING / APPROVED / REJECTED) */
    List<LeaveRequest> findByStatus(LeaveStatus status);

    /* 🔹 Fetch employee leaves by status */
    List<LeaveRequest> findByEmployee_EmpIdAndStatus(Long empId, LeaveStatus status);

    /* 🔹 Fetch leaves handled by a particular HR */
    List<LeaveRequest> findByHr_HrId(Long hrId);

    /* 🔹 Fetch leaves by department */
    List<LeaveRequest> findByEmployee_Department_DeptId(Long deptId);

    /* 🔹 Fetch leaves by HR and status */
    List<LeaveRequest> findByEmployee_Hr_HrIdAndStatus(Long hrId, LeaveStatus status);

}
