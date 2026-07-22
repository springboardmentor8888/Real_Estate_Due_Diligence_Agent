package com.realestate.due_diligence.permit;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "building_permit_records")
public class BuildingPermitRecord extends BaseEntity {

    private String permitNumber;

    private String permitType;

    private LocalDate issueDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}