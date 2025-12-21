package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByHospitalIdAndIsActive(String hospitalId, boolean isActive);
    List<Department> findByHospitalId(String hospitalId);
    Department findByHospitalIdAndName(String hospitalId, String name);
}