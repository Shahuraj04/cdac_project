package com.proj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proj.entity.Employee;

@Repository
public interface EmpRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByEmpId(Long empId);

    java.util.Optional<Employee> findByUser_Id(Long userId);

    java.util.Optional<Employee> findByUser_Email(String email);

    List<Employee> findByDepartment_DeptId(Long deptId);

    List<Employee> findByHr_HrId(Long hrId);

    List<Employee> findAllByIsDeletedTrue();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Employee e SET e.isDeleted = false WHERE e.empId = :empId")
    int reactivateByEmpId(@Param("empId") Long empId);
}
