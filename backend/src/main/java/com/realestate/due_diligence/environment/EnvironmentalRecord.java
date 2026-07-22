package com.realestate.due_diligence.environment;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "environmental_records")
public class EnvironmentalRecord extends BaseEntity {

    private String recordType;

    private String riskLevel;

    private String description;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}