package com.capstone.EventEase.Entity;


import java.time.OffsetDateTime;
import java.util.List;

public class AttendanceTimes {
    private List<OffsetDateTime> attendedTimes;
    private List<OffsetDateTime> timeoutTimes;

    public AttendanceTimes(List<OffsetDateTime> attendedTimes, List<OffsetDateTime> timeoutTimes) {
        this.attendedTimes = attendedTimes;
        this.timeoutTimes = timeoutTimes;
    }

    public List<OffsetDateTime> getAttendedTimes() {
        return attendedTimes;
    }

    public List<OffsetDateTime> getTimeoutTimes() {
        return timeoutTimes;
    }
}
