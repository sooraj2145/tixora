package com.tixora.backend.dto;

import com.tixora.backend.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long eventId,
        String eventTitle,
        Integer quantity,
        BigDecimal totalAmount,
        BookingStatus status,
        LocalDateTime createdAt
) {
}
