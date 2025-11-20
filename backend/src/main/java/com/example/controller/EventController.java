package com.example.controller;

import com.example.model.Event;
import com.example.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Event>> getActiveEvents() {
        return ResponseEntity.ok(eventService.getActiveEvents());
    }
    
    @GetMapping("/current")
    public ResponseEntity<List<Event>> getCurrentlyActiveEvents() {
        return ResponseEntity.ok(eventService.getCurrentlyActiveEvents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Event>> getEventsByLocation(@PathVariable String location) {
        return ResponseEntity.ok(eventService.getEventsByLocation(location));
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(start, end));
    }
    
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        Event savedEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }
    
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Event> toggleEventActive(@PathVariable Long id) {
        Event event = eventService.toggleEventActive(id);
        return ResponseEntity.ok(event);
    }
    
    @PostMapping("/{id}/finish")
    public ResponseEntity<Event> finishEvent(@PathVariable Long id) {
        Event event = eventService.finishEvent(id);
        return ResponseEntity.ok(event);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
