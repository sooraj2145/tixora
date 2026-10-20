package com.tixora.backend.controller;


import com.tixora.backend.dto.CreateEventRequest;
import com.tixora.backend.dto.EventResponse;
import com.tixora.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public Page<EventResponse> getPublishedEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String title
    ) {
        return eventService.getPublishedEvents(city,title, page, size);
    }

    @GetMapping("/{id}")
    public EventResponse getPublishedEventById(@PathVariable Long id) {
        return eventService.getPublishedEventById(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createEvent(
            @Valid @RequestBody CreateEventRequest request
            ) {
        return eventService.createEvent(request);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public EventResponse publishEvent(@PathVariable Long id) {
        return eventService.publishEvent(id);
    }
}
