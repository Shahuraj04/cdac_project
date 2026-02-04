package com.proj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.BankAccountResponseDTO;
import com.proj.service.BankAccountService;

@RestController
@RequestMapping("/bankaccounts")
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<BankAccountResponseDTO> getBankAccount(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                bankAccountService.getBankAccountByEmployeeId(employeeId)
        );
    }
}
