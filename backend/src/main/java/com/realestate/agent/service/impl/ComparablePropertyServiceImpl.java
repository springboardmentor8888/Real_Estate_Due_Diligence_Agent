package com.realestate.agent.service.impl;

import com.realestate.agent.dto.ComparablePropertyRequest;
import com.realestate.agent.dto.ComparablePropertyResponse;
import com.realestate.agent.entity.ComparableProperty;
import com.realestate.agent.entity.Property;
import com.realestate.agent.exception.DuplicateResourceException;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.mapper.ComparablePropertyMapper;
import com.realestate.agent.repository.ComparablePropertyRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.service.ComparablePropertyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComparablePropertyServiceImpl implements ComparablePropertyService {

    private final ComparablePropertyRepository comparablePropertyRepository;
    private final PropertyRepository propertyRepository;
    private final ComparablePropertyMapper comparablePropertyMapper;

    public ComparablePropertyServiceImpl(
            ComparablePropertyRepository comparablePropertyRepository,
            PropertyRepository propertyRepository,
            ComparablePropertyMapper comparablePropertyMapper
    ) {
        this.comparablePropertyRepository = comparablePropertyRepository;
        this.propertyRepository = propertyRepository;
        this.comparablePropertyMapper = comparablePropertyMapper;
    }

    @Override
    @Transactional
    public ComparablePropertyResponse createComparableProperty(ComparablePropertyRequest request) {

        if (comparablePropertyRepository
                .existsByPropertyPropertyIdAndComparablePropertyPropertyId(
                        request.getPropertyId(),
                        request.getComparablePropertyId())) {

            throw new DuplicateResourceException(
                    "Comparable property already exists for this property.");
        }

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with ID: "
                                        + request.getPropertyId()));

        Property comparableProperty = propertyRepository
                .findById(request.getComparablePropertyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comparable Property not found with ID: "
                                        + request.getComparablePropertyId()));

        ComparableProperty comparable =
                comparablePropertyMapper.toEntity(request);

        comparable.setProperty(property);
        comparable.setComparableProperty(comparableProperty);

        ComparableProperty savedComparable =
                comparablePropertyRepository.save(comparable);

        return comparablePropertyMapper.toResponse(savedComparable);
    }

    @Override
    @Transactional(readOnly = true)
    public ComparablePropertyResponse getComparablePropertyById(Long id) {

        ComparableProperty comparable =
                comparablePropertyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Comparable Property not found with ID: "
                                                + id));

        return comparablePropertyMapper.toResponse(comparable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComparablePropertyResponse> getComparablePropertiesByProperty(Long propertyId) {

        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException(
                    "Property not found with ID: " + propertyId);
        }

        return comparablePropertyRepository
                .findByPropertyPropertyId(propertyId)
                .stream()
                .map(comparablePropertyMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public ComparablePropertyResponse updateComparableProperty(
            Long id,
            ComparablePropertyRequest request) {

        ComparableProperty comparable =
                comparablePropertyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Comparable Property not found with ID: "
                                                + id));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with ID: "
                                        + request.getPropertyId()));

        Property comparableProperty =
                propertyRepository.findById(request.getComparablePropertyId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Comparable Property not found with ID: "
                                                + request.getComparablePropertyId()));

        comparablePropertyMapper.updateEntity(request, comparable);

        comparable.setProperty(property);
        comparable.setComparableProperty(comparableProperty);

        ComparableProperty updatedComparable =
                comparablePropertyRepository.save(comparable);

        return comparablePropertyMapper.toResponse(updatedComparable);
    }

    @Override
    @Transactional
    public void deleteComparableProperty(Long id) {

        ComparableProperty comparable =
                comparablePropertyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Comparable Property not found with ID: "
                                                + id));

        comparablePropertyRepository.delete(comparable);
    }

}