-- =========================================================
-- COOPERATIVE SOCIETY MANAGEMENT SYSTEM
-- DATABASE: cooperative_db
-- =========================================================

CREATE DATABASE IF NOT EXISTS cooperative_db;

USE cooperative_db;

-- =========================================================
-- 1. MEMBER
-- =========================================================

CREATE TABLE MEMBER (
    MemberID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    HouseNo VARCHAR(20),
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    PIN VARCHAR(10)
);


-- =========================================================
-- 2. COOPERATIVE SOCIETY
-- =========================================================

CREATE TABLE COOPERATIVE_SOCIETY (
    SocietyID INT PRIMARY KEY,
    SocietyName VARCHAR(100) NOT NULL,
    RegistrationDate DATE NOT NULL,
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    PIN VARCHAR(10)
);


-- =========================================================
-- 3. VILLAGE AREA
-- FD: VillageArea -> PIN
-- =========================================================

CREATE TABLE VILLAGE_AREA (
    VillageArea VARCHAR(100) PRIMARY KEY,
    PIN VARCHAR(10) NOT NULL
);


-- =========================================================
-- 4. STAFF
-- =========================================================

CREATE TABLE STAFF (
    StaffID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Designation VARCHAR(50) NOT NULL,
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    PIN VARCHAR(10)
);


-- =========================================================
-- 5. FUND
-- =========================================================

CREATE TABLE FUND (
    FundID INT PRIMARY KEY,
    FundType VARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(12,2) NOT NULL,

    CHECK (TotalAmount >= 0)
);


-- =========================================================
-- 6. MEMBER PHONE
-- Multivalued phone number of member
-- =========================================================

CREATE TABLE MEMBER_PHONE (
    MemberID INT,
    PhoneNo VARCHAR(15),

    PRIMARY KEY (MemberID, PhoneNo),

    FOREIGN KEY (MemberID)
        REFERENCES MEMBER(MemberID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 7. MEMBERSHIP
-- Member <-> Cooperative Society
-- Many-to-Many relationship
-- =========================================================

CREATE TABLE MEMBERSHIP (
    MemberID INT,
    SocietyID INT,
    JoinDate DATE NOT NULL,

    PRIMARY KEY (MemberID, SocietyID),

    FOREIGN KEY (MemberID)
        REFERENCES MEMBER(MemberID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (SocietyID)
        REFERENCES COOPERATIVE_SOCIETY(SocietyID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 8. COOPERATIVE GROUP
-- =========================================================

CREATE TABLE COOPERATIVE_GROUP (
    GroupID INT PRIMARY KEY,
    SocietyID INT NOT NULL,
    GroupName VARCHAR(100) NOT NULL,
    ForwardDate DATE,
    VillageArea VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),

    FOREIGN KEY (SocietyID)
        REFERENCES COOPERATIVE_SOCIETY(SocietyID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (VillageArea)
        REFERENCES VILLAGE_AREA(VillageArea)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================================
-- 9. MEMBER GROUP
-- Member <-> Group
-- Many-to-Many relationship
-- =========================================================

CREATE TABLE MEMBER_GROUP (
    MemberID INT,
    GroupID INT,
    Role VARCHAR(50),

    PRIMARY KEY (MemberID, GroupID),

    FOREIGN KEY (MemberID)
        REFERENCES MEMBER(MemberID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (GroupID)
        REFERENCES COOPERATIVE_GROUP(GroupID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 10. SAVINGS ACCOUNT
-- =========================================================

CREATE TABLE SAVINGS_ACCOUNT (
    AccountNo BIGINT PRIMARY KEY,
    MemberID INT NOT NULL,
    OpeningDate DATE NOT NULL,
    AccountType VARCHAR(30) NOT NULL,
    NomineeID INT,

    FOREIGN KEY (MemberID)
        REFERENCES MEMBER(MemberID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (NomineeID)
        REFERENCES MEMBER(MemberID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================================
-- 11. LOAN
-- =========================================================

CREATE TABLE LOAN (
    LoanID INT PRIMARY KEY,
    MemberID INT NOT NULL,
    LoanType VARCHAR(50) NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    StartDate DATE NOT NULL,
    Tenure INT NOT NULL,

    FOREIGN KEY (MemberID)
        REFERENCES MEMBER(MemberID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CHECK (Amount > 0),
    CHECK (Tenure > 0)
);


-- =========================================================
-- 12. LOAN FUND
-- Loan <-> Fund
-- Many-to-Many relationship
-- =========================================================

CREATE TABLE LOAN_FUND (
    LoanID INT,
    FundID INT,

    PRIMARY KEY (LoanID, FundID),

    FOREIGN KEY (LoanID)
        REFERENCES LOAN(LoanID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (FundID)
        REFERENCES FUND(FundID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 13. STAFF PHONE
-- Multivalued phone number of staff
-- =========================================================

CREATE TABLE STAFF_PHONE (
    StaffID INT,
    PhoneNo VARCHAR(15),

    PRIMARY KEY (StaffID, PhoneNo),

    FOREIGN KEY (StaffID)
        REFERENCES STAFF(StaffID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 14. REPAYMENT
-- Weak entity dependent on LOAN
-- =========================================================

CREATE TABLE REPAYMENT (
    LoanID INT,
    RepaymentNo INT,
    PaymentDate DATE NOT NULL,
    AmountPaid DECIMAL(12,2) NOT NULL,
    ModeOfPayment VARCHAR(30) NOT NULL,

    PRIMARY KEY (LoanID, RepaymentNo),

    FOREIGN KEY (LoanID)
        REFERENCES LOAN(LoanID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CHECK (AmountPaid > 0)
);


-- =========================================================
-- SAMPLE DATA
-- =========================================================


-- =========================================================
-- MEMBER DATA
-- =========================================================

INSERT INTO MEMBER
(MemberID, Name, DateOfBirth, HouseNo, Street, City, State, PIN)
VALUES
(1, 'Akshita', '2005-05-15', '12', 'Anna Street', 'Chennai', 'Tamil Nadu', '600001'),
(2, 'Rahul', '2004-08-20', '25', 'Gandhi Street', 'Chennai', 'Tamil Nadu', '600002'),
(3, 'Priya', '2005-01-10', '18', 'Temple Road', 'Madurai', 'Tamil Nadu', '625001'),
(4, 'Arjun', '2003-11-25', '42', 'Main Road', 'Coimbatore', 'Tamil Nadu', '641001'),
(5, 'Sneha', '2004-06-18', '7', 'Lake View Road', 'Salem', 'Tamil Nadu', '636001');


-- =========================================================
-- COOPERATIVE SOCIETY DATA
-- =========================================================

INSERT INTO COOPERATIVE_SOCIETY
(SocietyID, SocietyName, RegistrationDate, Street, City, State, PIN)
VALUES
(101, 'Chennai Farmers Cooperative', '2020-01-15',
 'Mount Road', 'Chennai', 'Tamil Nadu', '600003'),

(102, 'Madurai Rural Cooperative', '2019-06-20',
 'Main Bazaar', 'Madurai', 'Tamil Nadu', '625002'),

(103, 'Coimbatore Workers Cooperative', '2021-03-10',
 'RS Puram', 'Coimbatore', 'Tamil Nadu', '641002');


-- =========================================================
-- VILLAGE AREA DATA
-- =========================================================

INSERT INTO VILLAGE_AREA
(VillageArea, PIN)
VALUES
('Anna Nagar Village', '600001'),
('Gandhi Village', '600002'),
('Temple Village', '625001'),
('Main Road Village', '641001'),
('Lake View Village', '636001');


-- =========================================================
-- STAFF DATA
-- =========================================================

INSERT INTO STAFF
(StaffID, Name, Designation, Street, City, State, PIN)
VALUES
(201, 'Ramesh', 'Manager', 'Park Street', 'Chennai', 'Tamil Nadu', '600004'),
(202, 'Kumar', 'Accountant', 'Gandhi Road', 'Madurai', 'Tamil Nadu', '625003'),
(203, 'Divya', 'Clerk', 'Nehru Street', 'Coimbatore', 'Tamil Nadu', '641003'),
(204, 'Meena', 'Loan Officer', 'Market Road', 'Salem', 'Tamil Nadu', '636002'),
(205, 'Suresh', 'Field Officer', 'Temple Street', 'Chennai', 'Tamil Nadu', '600005');


-- =========================================================
-- FUND DATA
-- =========================================================

INSERT INTO FUND
(FundID, FundType, TotalAmount)
VALUES
(301, 'Government Fund', 500000.00),
(302, 'Member Contribution', 250000.00),
(303, 'Agriculture Fund', 400000.00),
(304, 'Emergency Fund', 150000.00),
(305, 'Women Empowerment Fund', 300000.00);


-- =========================================================
-- MEMBER PHONE DATA
-- =========================================================

INSERT INTO MEMBER_PHONE
(MemberID, PhoneNo)
VALUES
(1, '9876543210'),
(1, '9123456780'),
(2, '9876501234'),
(3, '9988776655'),
(4, '9090909090'),
(5, '9555555555');


-- =========================================================
-- MEMBERSHIP DATA
-- =========================================================

INSERT INTO MEMBERSHIP
(MemberID, SocietyID, JoinDate)
VALUES
(1, 101, '2022-01-10'),
(2, 101, '2022-03-15'),
(3, 102, '2022-05-20'),
(4, 103, '2023-01-12'),
(5, 101, '2023-04-18');


-- =========================================================
-- COOPERATIVE GROUP DATA
-- =========================================================

INSERT INTO COOPERATIVE_GROUP
(GroupID, SocietyID, GroupName, ForwardDate, VillageArea, City, State)
VALUES
(401, 101, 'Anna Farmers Group', '2022-02-01',
 'Anna Nagar Village', 'Chennai', 'Tamil Nadu'),

(402, 101, 'Gandhi Women Group', '2022-04-10',
 'Gandhi Village', 'Chennai', 'Tamil Nadu'),

(403, 102, 'Temple Farmers Group', '2022-06-15',
 'Temple Village', 'Madurai', 'Tamil Nadu'),

(404, 103, 'Main Road Workers Group', '2023-02-20',
 'Main Road Village', 'Coimbatore', 'Tamil Nadu');


-- =========================================================
-- MEMBER GROUP DATA
-- =========================================================

INSERT INTO MEMBER_GROUP
(MemberID, GroupID, Role)
VALUES
(1, 401, 'Leader'),
(2, 401, 'Member'),
(5, 402, 'Leader'),
(3, 403, 'Member'),
(4, 404, 'Leader');


-- =========================================================
-- SAVINGS ACCOUNT DATA
-- =========================================================

INSERT INTO SAVINGS_ACCOUNT
(AccountNo, MemberID, OpeningDate, AccountType, NomineeID)
VALUES
(100001, 1, '2022-01-15', 'Regular', 2),
(100002, 2, '2022-03-20', 'Regular', 1),
(100003, 3, '2022-06-01', 'Premium', 4),
(100004, 4, '2023-01-20', 'Regular', 5),
(100005, 5, '2023-05-01', 'Premium', 3);


-- =========================================================
-- LOAN DATA
-- =========================================================

INSERT INTO LOAN
(LoanID, MemberID, LoanType, Amount, StartDate, Tenure)
VALUES
(501, 1, 'Agriculture Loan', 100000.00, '2023-01-10', 24),
(502, 2, 'Business Loan', 150000.00, '2023-02-15', 36),
(503, 3, 'Education Loan', 80000.00, '2023-03-20', 24),
(504, 4, 'Housing Loan', 250000.00, '2023-04-10', 48),
(505, 5, 'Women Enterprise Loan', 120000.00, '2023-05-15', 36);


-- =========================================================
-- LOAN FUND DATA
-- =========================================================

INSERT INTO LOAN_FUND
(LoanID, FundID)
VALUES
(501, 303),
(502, 302),
(503, 301),
(504, 304),
(505, 305);


-- =========================================================
-- STAFF PHONE DATA
-- =========================================================

INSERT INTO STAFF_PHONE
(StaffID, PhoneNo)
VALUES
(201, '9000000001'),
(202, '9000000002'),
(203, '9000000003'),
(204, '9000000004'),
(205, '9000000005');


-- =========================================================
-- REPAYMENT DATA
-- =========================================================

INSERT INTO REPAYMENT
(LoanID, RepaymentNo, PaymentDate, AmountPaid, ModeOfPayment)
VALUES
(501, 1, '2023-02-10', 5000.00, 'Cash'),
(501, 2, '2023-03-10', 5000.00, 'UPI'),

(502, 1, '2023-03-15', 7000.00, 'Bank Transfer'),
(502, 2, '2023-04-15', 7000.00, 'UPI'),

(503, 1, '2023-04-20', 4000.00, 'Cash'),

(504, 1, '2023-05-10', 6000.00, 'Bank Transfer'),

(505, 1, '2023-06-15', 5000.00, 'UPI');


-- =========================================================
-- VERIFY DATABASE
-- =========================================================

SHOW TABLES;


-- Check number of records
SELECT 'MEMBER' AS TableName, COUNT(*) AS Records FROM MEMBER
UNION ALL
SELECT 'COOPERATIVE_SOCIETY', COUNT(*) FROM COOPERATIVE_SOCIETY
UNION ALL
SELECT 'VILLAGE_AREA', COUNT(*) FROM VILLAGE_AREA
UNION ALL
SELECT 'STAFF', COUNT(*) FROM STAFF
UNION ALL
SELECT 'FUND', COUNT(*) FROM FUND
UNION ALL
SELECT 'MEMBER_PHONE', COUNT(*) FROM MEMBER_PHONE
UNION ALL
SELECT 'MEMBERSHIP', COUNT(*) FROM MEMBERSHIP
UNION ALL
SELECT 'COOPERATIVE_GROUP', COUNT(*) FROM COOPERATIVE_GROUP
UNION ALL
SELECT 'MEMBER_GROUP', COUNT(*) FROM MEMBER_GROUP
UNION ALL
SELECT 'SAVINGS_ACCOUNT', COUNT(*) FROM SAVINGS_ACCOUNT
UNION ALL
SELECT 'LOAN', COUNT(*) FROM LOAN
UNION ALL
SELECT 'LOAN_FUND', COUNT(*) FROM LOAN_FUND
UNION ALL
SELECT 'STAFF_PHONE', COUNT(*) FROM STAFF_PHONE
UNION ALL
SELECT 'REPAYMENT', COUNT(*) FROM REPAYMENT;