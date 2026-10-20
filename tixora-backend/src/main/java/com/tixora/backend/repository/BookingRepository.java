package com.tixora.backend.repository;

import com.tixora.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByEventId(Long eventId);

    Optional<Booking> findByIdAndUserId(Long bookingId, Long userId);

}
