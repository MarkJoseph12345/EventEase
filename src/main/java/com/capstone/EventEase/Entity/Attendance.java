package com.capstone.EventEase.Entity;




import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Date;

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


    private OffsetDateTime attendedTime;
}
