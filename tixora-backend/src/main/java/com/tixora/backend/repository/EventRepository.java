package com.tixora.backend.repository;

import com.tixora.backend.entity.Event;
import com.tixora.backend.entity.EventStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event,Long> {

    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    Page<Event> findByStatusAndCityIgnoreCase(EventStatus status, String city, Pageable pageable);

    Page<Event> findByStatusAndTitleContainingIgnoreCase(
            EventStatus status,
            String title,
            Pageable pageable
    );

    Page<Event> findByStatusAndCityIgnoreCaseAndTitleContainingIgnoreCase(
            EventStatus status,
            String city,
            String title,
            Pageable pageable
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdForUpdate(@Param("id") Long id);

    List<Event> findByStatus(EventStatus status);

    List<Event> findByCityIgnoreCase(String city);

    List<Event> findByStatusAndCityIgnoreCase(EventStatus status, String city);
}
