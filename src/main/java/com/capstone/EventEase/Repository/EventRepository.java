package com.capstone.EventEase.Repository;


import com.capstone.EventEase.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Date;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {

    Event findByEventStarts(OffsetDateTime eventStarts);

}
