package com.realestate.due_diligence.zoning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ZoningInfoResponse {

    private Long id;

    private String zoningCode;

    private String zoningDescription;

    private String permittedUse;
}