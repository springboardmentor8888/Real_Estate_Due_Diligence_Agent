package com.infosys.realestate.repository;

import com.infosys.realestate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    /** New users registered in last N months grouped by month — used by admin analytics */
    @Query("SELECT FUNCTION('TO_CHAR', u.createdAt, 'YYYY-MM'), COUNT(u) " +
           "FROM User u WHERE u.createdAt >= :since " +
           "GROUP BY FUNCTION('TO_CHAR', u.createdAt, 'YYYY-MM') " +
           "ORDER BY FUNCTION('TO_CHAR', u.createdAt, 'YYYY-MM')")
    List<Object[]> countNewUsersByMonth(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);
}
