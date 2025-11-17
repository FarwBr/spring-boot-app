package com.example.service;

import com.example.model.CheckIn;
import com.example.repository.CheckInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CheckInService {
    
    @Autowired
    private CheckInRepository checkInRepository;
    
    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAll();
    }
    
    public Optional<CheckIn> getCheckInById(Long id) {
        return checkInRepository.findById(id);
    }
    
    public List<CheckIn> getCheckInsByUserName(String userName) {
        return checkInRepository.findByUserNameOrderByCheckInTimeDesc(userName);
    }
    
    public List<CheckIn> getCheckInsByLocation(String location) {
        return checkInRepository.findByLocationOrderByCheckInTimeDesc(location);
    }
    
    public List<CheckIn> getCheckInsByDateRange(LocalDateTime start, LocalDateTime end) {
        return checkInRepository.findByCheckInTimeBetween(start, end);
    }
    
    public List<CheckIn> getOfflineSyncedCheckIns() {
        return checkInRepository.findBySyncedFromOffline(true);
    }
    
    public CheckIn createCheckIn(CheckIn checkIn) {
        if (checkIn.getCheckInTime() == null) {
            checkIn.setCheckInTime(LocalDateTime.now());
        }
        return checkInRepository.save(checkIn);
    }
    
    public CheckIn updateCheckIn(Long id, CheckIn checkInDetails) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckIn not found with id: " + id));
        
        checkIn.setUserName(checkInDetails.getUserName());
        checkIn.setLocation(checkInDetails.getLocation());
        checkIn.setNotes(checkInDetails.getNotes());
        checkIn.setCheckInTime(checkInDetails.getCheckInTime());
        
        return checkInRepository.save(checkIn);
    }
    
    public void deleteCheckIn(Long id) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckIn not found with id: " + id));
        checkInRepository.delete(checkIn);
    }
    
    public List<CheckIn> syncOfflineCheckIns(List<CheckIn> offlineCheckIns) {
        offlineCheckIns.forEach(checkIn -> {
            checkIn.setSyncedFromOffline(true);
        });
        return checkInRepository.saveAll(offlineCheckIns);
    }
}
