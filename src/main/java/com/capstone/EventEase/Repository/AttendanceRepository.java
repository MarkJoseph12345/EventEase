package com.capstone.EventEase.Repository;

import com.capstone.EventEase.Entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {

}

