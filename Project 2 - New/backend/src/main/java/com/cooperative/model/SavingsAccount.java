package com.cooperative.model;

import java.time.LocalDate;

public class SavingsAccount {
    private Long accountNo;
    private Integer memberId;
    private LocalDate openingDate;
    private String accountType;
    private Integer nomineeId;

    public SavingsAccount() {}

    public Long getAccountNo() { return accountNo; }
    public void setAccountNo(Long accountNo) { this.accountNo = accountNo; }
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public LocalDate getOpeningDate() { return openingDate; }
    public void setOpeningDate(LocalDate openingDate) { this.openingDate = openingDate; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public Integer getNomineeId() { return nomineeId; }
    public void setNomineeId(Integer nomineeId) { this.nomineeId = nomineeId; }
}
