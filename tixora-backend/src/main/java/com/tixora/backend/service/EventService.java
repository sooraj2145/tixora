package com.tixora.backend.service;


import com.tixora.backend.dto.CreateEventRequest;
import com.tixora.backend.dto.EventResponse;
import com.tixora.backend.entity.Event;
import com.tixora.backend.entity.EventStatus;
import com.tixora.backend.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest request) {

        if(!request.endTime().isAfter(request.startTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Event end time must be after start time"
            );
        }

        Event event = new Event();
        event.setTitle(request.title().trim());
        event.setDescription(request.description());
        event.setVenue(request.venue().trim());
        event.setCity(request.city().trim());
        event.setCategory(request.category());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
        event.setTicketPrice(request.ticketPrice());
        event.setTotalCapacity(request.totalCapacity());
        event.setAvailableCapacity(request.totalCapacity());

        event.setStatus(EventStatus.DRAFT);

        Event savedEvent = eventRepository.save(event);

        return toResponse(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getPublishedEvents() {
        return eventRepository.findByStatus(EventStatus.PUBLISHED)
                .stream()
                .map(this::toResponse)
                .toList();


    }

    @Transactional(readOnly = true)
    public EventResponse getPublishedEventById(Long id) {
        Event event = eventRepository.findById(id)
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Published event not found"));

        return toResponse(event);
    }


    @Transactional
    public EventResponse publishEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event not found"
                ));

        if(event.getStatus() != EventStatus.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only draft events can be published");
        }

        event.setStatus(EventStatus.PUBLISHED);

        Event publishedEvent = eventRepository.save(event);

        return toResponse(publishedEvent);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> getPublishedEvents(
            String city,
            String title,
            int page,
            int size
    ) {
        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Page index cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Size must be between 1 and 100"
            );
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("startTime").ascending()
        );

        Page<Event> events;

        boolean hasCity = city != null && !city.isBlank();
        boolean hasTitle = title != null && !title.isBlank();


        if (hasCity && hasTitle) {
            events = eventRepository
                    .findByStatusAndCityIgnoreCaseAndTitleContainingIgnoreCase(
                            EventStatus.PUBLISHED,
                            city.trim(),
                            title.trim(),
                            pageable
                    );
        } else if (hasCity) {
            events = eventRepository.findByStatusAndCityIgnoreCase(
                    EventStatus.PUBLISHED,
                    city.trim(),
                    pageable
            );
        } else if (hasTitle) {
            events = eventRepository.findByStatusAndTitleContainingIgnoreCase(
                    EventStatus.PUBLISHED,
                    title.trim(),
                    pageable
            );
        } else {
            events = eventRepository.findByStatus(
                    EventStatus.PUBLISHED,
                    pageable
            );
        }


        return events.map(this::toResponse);
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getVenue(),
                event.getCity(),
                event.getCategory(),
                event.getStartTime(),
                event.getEndTime(),
                event.getTicketPrice(),
                event.getTotalCapacity(),
                event.getAvailableCapacity(),
                event.getStatus(),
                event.getCreatedAt()
        );
    }
}
