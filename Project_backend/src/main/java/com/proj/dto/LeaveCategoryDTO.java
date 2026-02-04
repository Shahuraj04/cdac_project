package com.proj.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveCategoryDTO {

    private String categoryCode;
    private String categoryName;
    private String description;
    private Integer maxDaysAllowed;
    private boolean requiresMedicalCert;
}
