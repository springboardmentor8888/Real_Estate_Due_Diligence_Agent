package com.realestate.due_diligence.util;

import com.realestate.due_diligence.property.Property;
import org.springframework.data.jpa.domain.Specification;

public class SearchSpecification {

    private SearchSpecification() {
    }

    public static Specification<Property> hasCity(String city) {

        return (root, query, criteriaBuilder) ->
                city == null || city.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("city")),
                        city.toLowerCase());
    }

    public static Specification<Property> hasState(String state) {

        return (root, query, criteriaBuilder) ->
                state == null || state.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("state")),
                        state.toLowerCase());
    }

    public static Specification<Property> hasZipCode(String zipCode) {

        return (root, query, criteriaBuilder) ->
                zipCode == null || zipCode.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        root.get("zipCode"),
                        zipCode);
    }

    public static Specification<Property> hasPropertyType(String propertyType) {

        return (root, query, criteriaBuilder) ->
                propertyType == null || propertyType.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("propertyType")),
                        propertyType.toLowerCase());
    }
}