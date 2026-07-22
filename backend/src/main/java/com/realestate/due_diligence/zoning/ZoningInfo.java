package com.realestate.due_diligence.zoning;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "zoning_info")
public class ZoningInfo extends BaseEntity {

    private String zoningCode;

    private String zoningDescription;

    private String permittedUse;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}