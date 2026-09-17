package com.cooperative.model;

public class MemberGroup {
    private Integer memberId;
    private Integer groupId;
    private String role;

    public MemberGroup() {}

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
