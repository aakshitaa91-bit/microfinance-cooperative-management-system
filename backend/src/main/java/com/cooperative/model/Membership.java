package com.cooperative.model;

import java.time.LocalDate;

public class Membership {
    private Integer memberId;
    private Integer societyId;
    private LocalDate joinDate;

    public Membership() {}

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getSocietyId() { return societyId; }
    public void setSocietyId(Integer societyId) { this.societyId = societyId; }
    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
}
