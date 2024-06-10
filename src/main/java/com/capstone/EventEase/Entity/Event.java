package com.capstone.EventEase.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_event")
public class Event {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String eventName;

    private String eventDescription;


    private OffsetDateTime eventStarts;


    private OffsetDateTime eventEnds;

    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "BYTEA")
    private byte[] eventPicture;

    private String eventPictureType;

    private String eventPictureName;

    private List<String> department;


    private String eventType;


}
