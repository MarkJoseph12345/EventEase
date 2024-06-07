package com.capstone.EventEase.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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


    private Date eventStarts;


    private Date eventEnds;


    @Lob
    @Basic(fetch = FetchType.EAGER)
    private byte[] eventPicture;

    private String eventPictureType;

    private String eventPictureName;



    private String department;


    private String eventType;


}
