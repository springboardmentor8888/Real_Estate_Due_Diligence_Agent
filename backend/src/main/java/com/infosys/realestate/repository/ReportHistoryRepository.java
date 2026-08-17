package com.infosys.realestate.repository;

import com.infosys.realestate.entity.ReportHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportHistoryRepository extends JpaRepository<ReportHistory, Long> {

    List<ReportHistory> findByUserUserIdOrderByGeneratedAtDesc(Long userId);

    Page<ReportHistory> findByUserUserIdOrderByGeneratedAtDesc(
            Long userId, Pageable pageable);

    List<ReportHistory> findByPropertyPropertyIdOrderByGeneratedAtDesc(
            Long propertyId);

    Page<ReportHistory> findByReportIdOrderByGeneratedAtDesc(
            Long reportId, Pageable pageable);

    Page<ReportHistory> findAllByOrderByGeneratedAtDesc(Pageable pageable);
}