package com.realestate.due_diligence.property;

import com.realestate.due_diligence.propertytax.PropertyTaxHistory;
import com.realestate.due_diligence.ownership.OwnershipRecord;
import com.realestate.due_diligence.common.BaseEntity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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

    private Double price;

    @Column(length = 1000) // Allows long image URLs
    private String imageUrl;

    // ✅ ADDED DUE DILIGENCE & STRUCTURAL FIELDS
    @Column(name = "survey_no")
    private String surveyNo;

    @Column(name = "registration_no")
    private String registrationNo;

    private String area;

    private Integer bedrooms;

    private Integer bathrooms;

    private String parking;

    private String furnishing;

    @OneToMany(mappedBy = "property")
    private List<OwnershipRecord> ownershipRecords;

    @OneToMany(mappedBy = "property")
    private List<PropertyTaxHistory> taxHistory;
}