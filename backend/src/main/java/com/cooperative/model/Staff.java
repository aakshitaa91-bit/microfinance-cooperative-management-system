package com.cooperative.model;

public class Staff {
    private Integer staffId;
    private String name;
    private String designation;
    private String street;
    private String city;
    private String state;
    private String pin;

    public Staff() {}

    public Integer getStaffId() { return staffId; }
    public void setStaffId(Integer staffId) { this.staffId = staffId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
