package com.realestate.due_diligence.propertyhistory;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "property_history")
public class PropertyHistory extends BaseEntity {

    private String eventType;

    private LocalDate eventDate;

    private String description;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}