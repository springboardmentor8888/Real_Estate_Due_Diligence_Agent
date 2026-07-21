package com.realestate.due_diligence.property;
import com.realestate.due_diligence.ownership.OwnershipRecord;
import java.util.List;
import com.realestate.due_diligence.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
    @OneToMany(mappedBy = "property")
private List<OwnershipRecord> ownershipRecords;
}