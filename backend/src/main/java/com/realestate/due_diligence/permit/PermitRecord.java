package com.realestate.due_diligence.permit;

import java.time.LocalDate;

import com.realestate.due_diligence.common.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "permit_records")
public class PermitRecord extends BaseEntity {

    private Long propertyId;

    private String permitNumber;

    private String permitType;

    private String status;

    private LocalDate issueDate;
}