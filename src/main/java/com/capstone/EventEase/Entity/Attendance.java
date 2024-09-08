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




    @ElementCollection
    @CollectionTable(name = "Attend_Date",joinColumns = @JoinColumn(name = "attendance_id"))
    @Column(name = "AttendedTime")
    @Cascade(CascadeType.ALL)
    @Builder.Default
    private List<OffsetDateTime> attendedTime = new ArrayList<>();


    @ElementCollection
    @CollectionTable(name = "Timeout_Date", joinColumns = @JoinColumn(name = "attendance_id"))
    @Column(name = "TimeOut")
    @Cascade(CascadeType.ALL)
    @Builder.Default
    private List<OffsetDateTime> timeOut = new ArrayList<>();

}
