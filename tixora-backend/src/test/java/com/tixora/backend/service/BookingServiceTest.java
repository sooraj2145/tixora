package com.tixora.backend.service;


import com.tixora.backend.dto.CreateBookingRequest;
import com.tixora.backend.entity.*;
import com.tixora.backend.repository.BookingRepository;
import com.tixora.backend.repository.EventRepository;
import com.tixora.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User user;
    private Event event;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        event = new Event();
        event.setId(2L);
        event.setTitle("Kochi Tech Summit 2026");
        event.setTicketPrice(new BigDecimal("1499.00"));
        event.setAvailableCapacity(300);
        event.setTotalCapacity(300);
        event.setStatus(EventStatus.PUBLISHED);
    }

    @Test
    void createBookingShouldCalculateTotalAndReduceCapacity() {
        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        when(eventRepository.findByIdForUpdate(2L))
                .thenReturn(Optional.of(event));

        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> {
                    Booking booking = invocation.getArgument(0);
                    booking.setId(1L);
                    return booking;
                });

        var response = bookingService.createBooking(
                new CreateBookingRequest(2L, 2),
                "user@example.com"
        );

        assertEquals(1L, response.id());
        assertEquals(2, response.quantity());
        assertEquals(
                new BigDecimal("2998.00"),
                response.totalAmount()
        );

        assertEquals(298, event.getAvailableCapacity());
        assertEquals(BookingStatus.CONFIRMED, response.status());

        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBookingShouldRejectInsufficientCapacity() {

        event.setAvailableCapacity(1);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        when(eventRepository.findByIdForUpdate(2L))
                .thenReturn(Optional.of(event));

        var exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> bookingService.createBooking(
                        new CreateBookingRequest(2L, 2),
                        "user@example.com"
                )
        );

        assertEquals(409, exception.getStatusCode().value());
        assertEquals(1, event.getAvailableCapacity());

        verify(bookingRepository, never()).save(any(Booking.class));
    }


    @Test
    void cancelBookingShouldRestoreCapacity() {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(2);
        booking.setTotalAmount(new BigDecimal("2998.00"));
        booking.setStatus(BookingStatus.CONFIRMED);

        event.setAvailableCapacity(298);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        when(bookingRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(booking));

        when(eventRepository.findByIdForUpdate(2L))
                .thenReturn(Optional.of(event));

        var response = bookingService.cancelBooking(
                1L,
                "user@example.com"
        );

        assertEquals(BookingStatus.CANCELLED, response.status());
        assertEquals(300, event.getAvailableCapacity());
    }



    @Test
    void cancelBookingShouldRejectAlreadyCancelledBooking() {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(2);
        booking.setTotalAmount(new BigDecimal("2998.00"));
        booking.setStatus(BookingStatus.CANCELLED);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        when(bookingRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(booking));

        var exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> bookingService.cancelBooking(1L, "user@example.com")
        );

        assertEquals(409, exception.getStatusCode().value());
        verify(eventRepository, never()).findByIdForUpdate(anyLong());
    }


}
