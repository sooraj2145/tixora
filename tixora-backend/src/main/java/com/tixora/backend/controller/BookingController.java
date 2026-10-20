package com.tixora.backend.controller;


import com.tixora.backend.dto.BookingResponse;
import com.tixora.backend.dto.CreateBookingRequest;
import com.tixora.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication
    ) {
        return bookingService.createBooking(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(
            Authentication authentication
    ) {
        return bookingService.getMyBookings(
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public BookingResponse cancelBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.cancelBooking(
                id,
                authentication.getName()
        );
    }
}
