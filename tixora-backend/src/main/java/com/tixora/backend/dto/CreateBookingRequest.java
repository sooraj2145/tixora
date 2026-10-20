package com.tixora.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateBookingRequest(

        @NotNull(message = "Event ID is required")
        @Positive(message = "Event ID must be positive")
        Long eventId,

        @NotNull(message = "Ticket quantity is required")
        @Positive(message = "Ticket quantity must be at least 1")
        Integer quantity
) {
}
