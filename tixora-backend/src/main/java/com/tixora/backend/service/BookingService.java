package com.tixora.backend.service;


import com.tixora.backend.dto.BookingResponse;
import com.tixora.backend.dto.CreateBookingRequest;
import com.tixora.backend.entity.*;
import com.tixora.backend.repository.BookingRepository;
import com.tixora.backend.repository.EventRepository;
import com.tixora.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(
            CreateBookingRequest request,
            String userEmail
    ) {
        User user =  userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        Event event = eventRepository.findByIdForUpdate(request.eventId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event not found"
                ));

        if (event.getStatus() != EventStatus.PUBLISHED){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tickets can only be booked for published events"
            );
        }

        if(request.quantity() > event.getAvailableCapacity()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Not enough tickets available"
            );

        }

        BigDecimal totalAmount = event.getTicketPrice()
                .multiply(BigDecimal.valueOf(request.quantity()));

        event.setAvailableCapacity(
                event.getAvailableCapacity() -  request.quantity()
        );

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(request.quantity());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        return new BookingResponse(
                savedBooking.getId(),
                event.getId(),
                event.getTitle(),
                savedBooking.getQuantity(),
                savedBooking.getTotalAmount(),
                savedBooking.getStatus(),
                savedBooking.getCreatedAt()
        );
    }


    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        return bookingRepository.findByUserId(user.getId())
                .stream()
                .map(booking -> new BookingResponse(
                        booking.getId(),
                        booking.getEvent().getId(),
                        booking.getEvent().getTitle(),
                        booking.getQuantity(),
                        booking.getTotalAmount(),
                        booking.getStatus(),
                        booking.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        Booking booking = bookingRepository.findByIdAndUserId(
                bookingId, user.getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Booking not found"
        ));

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Booking is already cancelled"
            );
        }

        Event event = eventRepository.findByIdForUpdate(
                booking.getEvent().getId()
        )
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event not found"
                ));

        event.setAvailableCapacity(
                event.getAvailableCapacity() + booking.getQuantity()
        );

        booking.setStatus(BookingStatus.CANCELLED);

        return new BookingResponse(
                booking.getId(),
                event.getId(),
                event.getTitle(),
                booking.getQuantity(),
                booking.getTotalAmount(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }


}
