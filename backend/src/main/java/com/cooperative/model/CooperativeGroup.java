package com.cooperative.model;

import java.time.LocalDate;

public class CooperativeGroup {
    private Integer groupId;
    private Integer societyId;
    private String groupName;
    private LocalDate forwardDate;
    private String villageArea;
    private String city;
    private String state;

    public CooperativeGroup() {}

    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }
    public Integer getSocietyId() { return societyId; }
    public void setSocietyId(Integer societyId) { this.societyId = societyId; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public LocalDate getForwardDate() { return forwardDate; }
    public void setForwardDate(LocalDate forwardDate) { this.forwardDate = forwardDate; }
    public String getVillageArea() { return villageArea; }
    public void setVillageArea(String villageArea) { this.villageArea = villageArea; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
