package com.example.dto;

import com.example.model.Participant;
import com.example.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantWithEventDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private Boolean checkedIn;
    private LocalDateTime checkInTime;
    private Boolean isWalkIn;
    private EventSummaryDTO event;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventSummaryDTO {
        private Long id;
        private String name;
        private String description;
        private String location;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer maxCapacity;
        private Boolean active;
    }
    
    public static ParticipantWithEventDTO fromParticipant(Participant participant) {
        ParticipantWithEventDTO dto = new ParticipantWithEventDTO();
        dto.setId(participant.getId());
        dto.setName(participant.getName());
        dto.setEmail(participant.getEmail());
        dto.setPhone(participant.getPhone());
        dto.setCompany(participant.getCompany());
        dto.setCheckedIn(participant.getCheckedIn());
        dto.setCheckInTime(participant.getCheckInTime());
        dto.setIsWalkIn(participant.getIsWalkIn());
        
        if (participant.getEvent() != null) {
            Event event = participant.getEvent();
            EventSummaryDTO eventDTO = new EventSummaryDTO();
            eventDTO.setId(event.getId());
            eventDTO.setName(event.getName());
            eventDTO.setDescription(event.getDescription());
            eventDTO.setLocation(event.getLocation());
            eventDTO.setStartTime(event.getStartTime());
            eventDTO.setEndTime(event.getEndTime());
            eventDTO.setMaxCapacity(event.getMaxCapacity());
            eventDTO.setActive(event.getActive());
            dto.setEvent(eventDTO);
        }
        
        return dto;
    }
}
