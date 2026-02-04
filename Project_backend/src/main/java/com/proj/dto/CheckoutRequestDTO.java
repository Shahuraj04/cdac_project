package com.proj.dto;

import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequestDTO {

    private Long empId;

    /**
     * Explicit checkout time. If null, backend will use current server time.
     */
    private LocalTime checkoutTime;
}

