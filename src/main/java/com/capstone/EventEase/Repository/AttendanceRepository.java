package com.capstone.EventEase.Repository;

import com.capstone.EventEase.Entity.Attendance;
import com.capstone.EventEase.Entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {



    Optional<Attendance> findByUserevent(UserEvent userEvent);


   // Optional<Attendance> findByUserIdAndEventId(Long userId, Long eventId);
   // List<Attendance>findAllByUserevent(List<UserEvent> userEvent);






   // void delete(Optional<Attendance> attend);
}

