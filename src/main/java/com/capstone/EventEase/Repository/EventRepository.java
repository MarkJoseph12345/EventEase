package com.capstone.EventEase.Repository;


import com.capstone.EventEase.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {

    Event findByEventStarts(OffsetDateTime eventStarts);

//    @Query("SELECT e FROM Event e WHERE :now BETWEEN e.eventStarts AND e.eventEnds")
   // @Query("SELECT e FROM Event e WHERE :now BETWEEN e.eventStarts.minusMinutes(5) AND e.eventStarts.plusMinutes(5)")
   // Optional<Event> findByCurrentEvent(@Param("now") OffsetDateTime now);
//

//    @Query("SELECT e FROM Event e WHERE :now BETWEEN :start AND :end")
//    Optional<Event> findByCurrentEvent(@Param("now") OffsetDateTime now,@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);


//
//    @Query(value = "SELECT * FROM tbl_event WHERE :now BETWEEN event_starts - INTERVAL '5 minutes' AND event_ends + INTERVAL '5 minutes'", nativeQuery = true)
//    Optional<Event> findByCurrentEvent(@Param("now") OffsetDateTime now);






    //@Query(value = "SELECT * FROM tbl_event WHERE :now BETWEEN event_starts - INTERVAL '5 minutes' AND event_ends + INTERVAL '5 minutes'", nativeQuery = true)
     @Query("SELECT e FROM Event e WHERE :now BETWEEN e.eventStarts AND e.eventEnds")
    List<Event> findByCurrentEvent(@Param("now") OffsetDateTime now);



}



