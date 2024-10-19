package com.capstone.EventEase.Entity;


import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;


@Data
public class AttendanceTimes {
    private List<OffsetDateTime> attendedTimes;
    private List<OffsetDateTime> timeoutTimes;

    private Long userId;
    private Long eventId;

    public AttendanceTimes() {
    }

    public AttendanceTimes(List<OffsetDateTime> attendedTimes, List<OffsetDateTime> timeoutTimes, Long userId, Long eventId) {
        this.attendedTimes = attendedTimes;
        this.userId = userId;
        this.eventId = eventId;
        this.timeoutTimes = timeoutTimes;
    }


}
