package com.capstone.EventEase.Repository;


import com.capstone.EventEase.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {

    Event findByEventStarts(OffsetDateTime eventStarts);

    @Query("SELECT e FROM Event e WHERE :now BETWEEN e.eventStarts AND e.eventEnds")
    Optional<Event> findByCurrentEvent(@Param("now") OffsetDateTime now);

}


