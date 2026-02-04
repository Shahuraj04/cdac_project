package com.proj.service;

import com.proj.dto.BankAccountResponseDTO;

public interface BankAccountService {

    BankAccountResponseDTO getBankAccountByEmployeeId(Long employeeId);
}
