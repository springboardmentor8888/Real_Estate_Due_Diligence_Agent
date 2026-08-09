package com.realestate.due_diligence.property;

import com.realestate.due_diligence.propertytax.PropertyTaxHistory;
import com.realestate.due_diligence.ownership.OwnershipRecord;
import java.util.List;
import com.realestate.due_diligence.common.BaseEntity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "properties")
public class Property extends BaseEntity {

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String propertyType;

    // ✅ ADD THESE TWO FIELDS
    private Double price;

    @Column(length = 1000) // Allows long image URLs
    private String imageUrl;

    @OneToMany(mappedBy = "property")
    private List<OwnershipRecord> ownershipRecords;

    @OneToMany(mappedBy = "property")
    private List<PropertyTaxHistory> taxHistory;
}