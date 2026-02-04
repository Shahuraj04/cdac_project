package com.proj.entity;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "emp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@SQLDelete(sql = "UPDATE emp SET is_deleted = true WHERE emp_id = ?")
@Where(clause = "is_deleted = false")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_id")
    private Long empId;

    @Column(nullable = false)
    private String emp_name;

    @OneToOne(cascade = jakarta.persistence.CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private LocalDate joinDate;

    @ManyToOne
    @JoinColumn(name = "deptId", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "hrId", nullable = false)
    private Hr hr;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}
