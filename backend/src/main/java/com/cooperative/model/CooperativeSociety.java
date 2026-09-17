package com.cooperative.model;

import java.time.LocalDate;

public class CooperativeSociety {
    private Integer societyId;
    private String societyName;
    private LocalDate registrationDate;
    private String street;
    private String city;
    private String state;
    private String pin;

    public CooperativeSociety() {}

    public Integer getSocietyId() { return societyId; }
    public void setSocietyId(Integer societyId) { this.societyId = societyId; }
    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }
    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
