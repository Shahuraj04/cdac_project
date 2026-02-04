package com.proj.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proj.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

  /* Check duplicate attendance (employee + date) */
  boolean existsByEmployee_EmpIdAndAttendanceDate(Long empId, LocalDate attendanceDate);

  /* Employee views attendance history */
  List<Attendance> findByEmployee_EmpId(Long empId);

  /* Optional: fetch attendance by date */
  List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

  /* Company-wide attendance for date range (for admin view) */
  List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);

  /* Single record for employee on specific date */
  java.util.Optional<Attendance> findByEmployee_EmpIdAndAttendanceDate(Long empId, LocalDate attendanceDate);

  /* Ranged queries for timesheet views */
  List<Attendance> findByEmployee_EmpIdAndAttendanceDateBetween(Long empId, LocalDate startDate, LocalDate endDate);

  List<Attendance> findByEmployee_EmpIdAndAttendanceDateBetweenAndStatus(
      Long empId,
      LocalDate startDate,
      LocalDate endDate,
      com.proj.entity.AttendanceStatus status);

  List<Attendance> findByHr_HrIdAndAttendanceDateBetween(Long hrId, LocalDate startDate, LocalDate endDate);

  List<Attendance> findByHr_HrIdAndAttendanceDateBetweenAndStatus(
      Long hrId,
      LocalDate startDate,
      LocalDate endDate,
      com.proj.entity.AttendanceStatus status);

  /* Monthly summary: returns [status, count] per status */
  @Query("""
          SELECT a.status, COUNT(a)
          FROM Attendance a
          WHERE a.employee.empId = :empId
            AND MONTH(a.attendanceDate) = :month
            AND YEAR(a.attendanceDate) = :year
          GROUP BY a.status
      """)
  List<Object[]> getMonthlyAttendanceSummary(
      @Param("empId") Long empId,
      @Param("month") int month,
      @Param("year") int year);

  List<Attendance> findTop10ByOrderByAttendanceDateDesc();

  List<Attendance> findTop10ByHr_HrIdOrderByAttendanceDateDesc(Long hrId);
}
