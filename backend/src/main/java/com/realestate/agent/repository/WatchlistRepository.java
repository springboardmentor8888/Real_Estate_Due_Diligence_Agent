package com.realestate.agent.repository;

import com.realestate.agent.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    @Query("SELECT w FROM Watchlist w WHERE w.user.userId = :userId")
    List<Watchlist> findByUserId(@Param("userId") Long userId);

    @Query("SELECT w FROM Watchlist w WHERE w.user.email = :email")
    List<Watchlist> findByUserEmail(@Param("email") String email);

    @Query("SELECT COUNT(w) > 0 FROM Watchlist w WHERE w.user.email = :email AND w.property.propertyId = :propertyId")
    boolean existsByUserEmailAndPropertyId(@Param("email") String email, @Param("propertyId") Long propertyId);
}
