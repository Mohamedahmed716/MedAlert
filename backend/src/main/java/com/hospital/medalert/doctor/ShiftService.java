package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ShiftDTO;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Shift;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShiftService {

    private final DoctorRepository doctorRepository;
    private final ShiftRepository shiftRepository;

    public ShiftDTO getTodayShift(String email) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 2. Get the current date
        LocalDate today = LocalDate.now();

        // 3. Find the shift for this doctor, today
        Optional<Shift> shiftOptional = shiftRepository.findByDoctorAndDate(doctor, today);

        // 4. If a shift exists, map it to DTO. If not, return null (or throw exception)
        if (shiftOptional.isPresent()) {
            Shift shift = shiftOptional.get();
            return ShiftDTO.builder()
                    .startTime(shift.getStartTime())
                    .endTime(shift.getEndTime())
                    .date(shift.getDate())
                    .build();
        } else {
            // Handle cases where the doctor is off-duty today
            return null;
        }
    }
}
