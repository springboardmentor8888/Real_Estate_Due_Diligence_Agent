package com.realestate.repository;

import com.realestate.entity.Permit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermitRepository extends JpaRepository<Permit, Long> {

    List<Permit> findByPropertyAddress(String propertyAddress);

}