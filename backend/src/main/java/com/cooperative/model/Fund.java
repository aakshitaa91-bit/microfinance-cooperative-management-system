package com.cooperative.model;

import java.math.BigDecimal;

public class Fund {
    private Integer fundId;
    private String fundType;
    private BigDecimal totalAmount;

    public Fund() {}

    public Integer getFundId() { return fundId; }
    public void setFundId(Integer fundId) { this.fundId = fundId; }
    public String getFundType() { return fundType; }
    public void setFundType(String fundType) { this.fundType = fundType; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
