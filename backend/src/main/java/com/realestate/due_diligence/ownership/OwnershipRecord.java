package com.realestate.due_diligence.ownership;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "ownership_records")
public class OwnershipRecord extends BaseEntity {

    private String ownerName;

    private LocalDate purchaseDate;

    private Double purchasePrice;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}