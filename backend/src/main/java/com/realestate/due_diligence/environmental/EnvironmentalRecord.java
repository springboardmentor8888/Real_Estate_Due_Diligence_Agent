package com.realestate.due_diligence.environmental;

import com.realestate.due_diligence.common.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "environmental_records")
public class EnvironmentalRecord extends BaseEntity {

    private Long propertyId;

    private String environmentalRisk;

    private String contaminationLevel;

    private String remarks;
}