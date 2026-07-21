package com.realestate.due_diligence.propertytax;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "property_tax_history")
public class PropertyTaxHistory extends BaseEntity {

    private Integer taxYear;

    private Double taxAmount;

    private String paymentStatus;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}