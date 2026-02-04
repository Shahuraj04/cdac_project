package com.proj.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankAccountResponseDTO {

    private Long bankAccountId;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String branchName;

    // Flattened employee info
    private Long empId;
    private String empName;
}
