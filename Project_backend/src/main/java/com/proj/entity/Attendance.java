package com.proj.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "emp_id", "attendance_date" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;

    @Column(name = "attendance_time")
    private LocalTime attendanceTime;

    @Column(name = "checkout_time")
    private LocalTime checkoutTime;

    @Column(name = "total_hours", precision = 4, scale = 2)
    private BigDecimal totalHours;

    /* Many attendance records belong to one employee */
    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    /* HR who marked attendance */
    @ManyToOne
    @JoinColumn(name = "hr_id", nullable = true)
    private Hr hr;
}
