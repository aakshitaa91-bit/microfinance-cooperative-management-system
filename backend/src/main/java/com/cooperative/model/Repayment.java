package com.cooperative.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Repayment {
    private Integer loanId;
    private Integer repaymentNo;
    private LocalDate paymentDate;
    private BigDecimal amountPaid;
    private String modeOfPayment;

    public Repayment() {}

    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }
    public Integer getRepaymentNo() { return repaymentNo; }
    public void setRepaymentNo(Integer repaymentNo) { this.repaymentNo = repaymentNo; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    public String getModeOfPayment() { return modeOfPayment; }
    public void setModeOfPayment(String modeOfPayment) { this.modeOfPayment = modeOfPayment; }
}
