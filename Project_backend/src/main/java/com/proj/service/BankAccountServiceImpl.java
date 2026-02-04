package com.proj.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proj.dto.BankAccountResponseDTO;
import com.proj.entity.BankAccount;
import com.proj.repository.BankAccountRepository;

@Service
public class BankAccountServiceImpl implements BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public BankAccountResponseDTO getBankAccountByEmployeeId(Long employeeId) {

        BankAccount bankAccount = bankAccountRepository
                .findByEmployee_EmpId(employeeId)
                .orElseThrow(() ->
                        new RuntimeException("Bank account not found"));

        // Entity → DTO
        BankAccountResponseDTO dto =
                modelMapper.map(bankAccount, BankAccountResponseDTO.class);

        // Flatten employee details
        dto.setEmpId(bankAccount.getEmployee().getEmpId());
        dto.setEmpName(bankAccount.getEmployee().getEmp_name());

        return dto;
    }
}
