package com.cooperative.model;

import java.time.LocalDate;

public class Member {
    private Integer memberId;
    private String name;
    private LocalDate dateOfBirth;
    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pin;

    public Member() {}

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getHouseNo() { return houseNo; }
    public void setHouseNo(String houseNo) { this.houseNo = houseNo; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
