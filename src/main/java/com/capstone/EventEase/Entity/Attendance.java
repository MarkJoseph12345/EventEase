package com.capstone.EventEase.Entity;




import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_attendance")
public class Attendance {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @ManyToOne
    @JoinColumn(name = "userevent_id")
    private UserEvent userevent;

    @Column(name = "AttendedTime")
    private List<OffsetDateTime> attendedTime = new ArrayList<>();



    @Column(name = "TimeOut")
    private List<OffsetDateTime> timeOut = new ArrayList<>();
}
