package com.proj.entity;

import java.time.LocalDate;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leave_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_id")
    private Long leaveId;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String reason;

    @Column(name = "leave_category", length = 50)
    private String leaveCategory;

    @Column(name = "leave_sub_category", length = 100)
    private String leaveSubCategory;

    /* ENUM Mapping */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status;

    /* Many leaves belong to one employee */
    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    /* HR who approves/rejects */
    @ManyToOne
    @JoinColumn(name = "hr_id")
    private Hr hr;
}
