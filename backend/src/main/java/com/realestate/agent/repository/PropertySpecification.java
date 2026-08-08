package com.realestate.agent.repository;

import com.realestate.agent.dto.PropertySearchCriteria;
import com.realestate.agent.entity.Address;
import com.realestate.agent.entity.Property;
import com.realestate.agent.entity.PropertyType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> build(PropertySearchCriteria criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Avoid duplicate rows when fetching properties with multiple child associations
            if (Long.class.equals(query.getResultType())) {
                // Do not set distinct on count queries to avoid JPA issues
            } else {
                query.distinct(true);
            }

            Join<Property, Address> addressJoin = null;

            // Filter by City
            if (StringUtils.hasText(criteria.getCity())) {
                addressJoin = root.join("addresses", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(addressJoin.get("city")),
                        criteria.getCity().toLowerCase().trim()
                ));
            }

            // Filter by State
            if (StringUtils.hasText(criteria.getState())) {
                if (addressJoin == null) {
                    addressJoin = root.join("addresses", JoinType.LEFT);
                }
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(addressJoin.get("state")),
                        criteria.getState().toLowerCase().trim()
                ));
            }

            // Filter by Postal Code
            if (StringUtils.hasText(criteria.getPostalCode())) {
                if (addressJoin == null) {
                    addressJoin = root.join("addresses", JoinType.LEFT);
                }
                predicates.add(criteriaBuilder.equal(
                        addressJoin.get("postalCode"),
                        criteria.getPostalCode().trim()
                ));
            }

            // Filter by Property Type
            if (StringUtils.hasText(criteria.getPropertyType())) {
                Join<Property, PropertyType> typeJoin = root.join("propertyType", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(typeJoin.get("typeName")),
                        criteria.getPropertyType().toLowerCase().trim()
                ));
            }

            // Filter by Status
            if (criteria.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), criteria.getStatus()));
            }

            // Filter by Min Market Value
            if (criteria.getMinMarketValue() != null) {
                predicates.add(criteriaBuilder.ge(root.get("marketValue"), criteria.getMinMarketValue()));
            }

            // Filter by Max Market Value
            if (criteria.getMaxMarketValue() != null) {
                predicates.add(criteriaBuilder.le(root.get("marketValue"), criteria.getMaxMarketValue()));
            }

            // Filter by Built Year
            if (criteria.getBuiltYear() != null) {
                predicates.add(criteriaBuilder.equal(root.get("builtYear"), criteria.getBuiltYear()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
