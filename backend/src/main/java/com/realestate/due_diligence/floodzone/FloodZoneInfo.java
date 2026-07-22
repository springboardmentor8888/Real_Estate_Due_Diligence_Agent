package com.realestate.due_diligence.floodzone;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "flood_zone_info")
public class FloodZoneInfo extends BaseEntity {

    private String floodZoneCode;

    private String floodRiskLevel;

    private Boolean floodInsuranceRequired;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}