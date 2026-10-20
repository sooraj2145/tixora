
package com.tixora.backend.dto;

import com.tixora.backend.entity.EventCategory;
import com.tixora.backend.entity.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        String venue,
        String city,
        EventCategory category,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BigDecimal ticketPrice,
        Integer totalCapacity,
        Integer availableCapacity,
        EventStatus status,
        LocalDateTime createdAt
) {
}
