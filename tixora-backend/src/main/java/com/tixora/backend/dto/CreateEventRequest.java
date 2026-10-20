
package com.tixora.backend.dto;

import com.tixora.backend.entity.EventCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateEventRequest(

        @NotBlank
        String title,

        String description,

        @NotBlank
        String venue,

        @NotBlank
        String city,

        @NotNull
        EventCategory category,

        @NotNull
        @Future
        LocalDateTime startTime,

        @NotNull
        @Future
        LocalDateTime endTime,

        @NotNull
        @DecimalMin("0.00")
        BigDecimal ticketPrice,

        @NotNull
        @Positive
        Integer totalCapacity

) {
}
