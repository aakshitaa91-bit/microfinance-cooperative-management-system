# Microfinance and Cooperative Society Management System

A full-stack database management application designed to manage members, cooperative societies, groups, savings accounts, loans, funds, repayments, staff, and related information in a centralized system.

The project provides a web-based frontend connected to a Java Spring Boot backend using JDBC, with MySQL as the database.

---

## Project Overview

The Microfinance and Cooperative Society Management System is designed to digitally manage the major operations of a cooperative society and microfinance organization.

The system allows administrators to:

- Manage cooperative society members
- Manage cooperative societies
- Manage village/area information
- Manage staff
- Manage funds
- Manage member phone numbers
- Manage memberships
- Manage cooperative groups
- Manage group membership
- Manage savings accounts
- Manage loans
- Manage loan-fund relationships
- Manage staff phone numbers
- Manage loan repayments
- View an overall dashboard with database statistics

The system follows a structured relational database design with primary keys, foreign keys, composite keys, and many-to-many relationship tables.

---

# Key Features

## 1. Dashboard

The dashboard provides an overview of the system using summary cards.

It displays counts for important entities such as:

- Members
- Cooperative Societies
- Village Areas
- Staff
- Funds
- Cooperative Groups
- Savings Accounts
- Loans
- Repayments

The dashboard also provides quick navigation to the major management modules.

---

# Member Management

The Member Management module is used to maintain member information.

### Functionalities

- Add a new member
- View all members
- Edit existing member information
- Delete a member
- Search/view member records
- Validate required fields
- Prevent duplicate Member IDs through database constraints

### Member information includes

- Member ID
- Name
- Date of Birth
- House Number
- Street
- City
- State
- PIN

---

# Cooperative Society Management

This module manages cooperative society information.

### Functionalities

- Add cooperative society
- View cooperative societies
- Edit society details
- Delete society
- Validate required fields

### Society information includes

- Society ID
- Society Name
- Registration Date
- Street
- City
- State
- PIN

---

# Village Area Management

This module manages the geographical areas associated with cooperative groups.

### Functionalities

- Add village/area
- View village areas
- Edit village/area information
- Delete village/area
- Validate required fields

### Information includes

- Village Area
- PIN

---

# Staff Management

This module maintains staff information.

### Functionalities

- Add staff member
- View staff
- Edit staff details
- Delete staff
- Manage staff designation
- Validate required fields

### Staff information includes

- Staff ID
- Name
- Designation
- Street
- City
- State
- PIN

---

# Fund Management

The Fund Management module manages financial funds available within the system.

### Functionalities

- Add fund
- View funds
- Edit fund information
- Delete fund
- Manage fund type
- Manage total fund amount

### Fund information includes

- Fund ID
- Fund Type
- Total Amount

---

# Member Phone Management

Members can have multiple phone numbers.

This module manages member phone records.

### Functionalities

- Add member phone number
- View phone numbers
- Edit phone number
- Delete phone number

The table uses a composite primary key:

`MemberID + PhoneNo`

This allows a member to have multiple phone numbers while maintaining uniqueness.

---

# Membership Management

The Membership module represents the relationship between members and cooperative societies.

A member can belong to multiple societies, and a society can have multiple members.

Therefore, this is a:

**Many-to-Many (M:N) relationship**

implemented using the `MEMBERSHIP` table.

### Functionalities

- Add member-society membership
- View memberships
- Edit membership
- Delete membership

### Composite Primary Key

`MemberID + SocietyID`

---

# Cooperative Group Management

This module manages groups formed under cooperative societies.

### Functionalities

- Add cooperative group
- View groups
- Edit group information
- Delete group
- Associate group with a cooperative society
- Associate group with a village area

### Relationships

A cooperative society can have multiple groups.

A village area can be associated with multiple groups.

---

# Member Group Management

This module manages the relationship between members and cooperative groups.

A member can belong to multiple groups, and a group can contain multiple members.

Therefore, this is another:

**Many-to-Many (M:N) relationship**

implemented using the `MEMBER_GROUP` table.

### Functionalities

- Add member to group
- View member-group relationships
- Edit relationship
- Delete relationship

### Composite Primary Key

`MemberID + GroupID`

---

# 🏦 Savings Account Management

This module manages savings accounts belonging to members.

### Functionalities

- Create savings account
- View savings accounts
- Edit account information
- Delete savings account
- Associate an account with a member
- Assign a nominee

### Savings Account information

- Account Number
- Member ID
- Opening Date
- Account Type
- Nominee ID

The system uses member references for both the account owner and nominee.

---

# Loan Management

The Loan Management module manages loans issued to members.

### Functionalities

- Add loan
- View loans
- Edit loan information
- Delete loan
- Associate a loan with a member
- Manage loan details

Loans are connected to members using a foreign key.

---

# Loan Fund Management

A loan can be associated with multiple funds, and a fund can support multiple loans.

Therefore, this module represents a:

**Many-to-Many (M:N) relationship**

between loans and funds.

The relationship is implemented using the `LOAN_FUND` table.

### Functionalities

- Associate loan with fund
- View loan-fund relationships
- Edit relationship
- Delete relationship

### Composite Primary Key

`LoanID + FundID`

---

# Staff Phone Management

Staff members may have multiple phone numbers.

This module manages staff phone records.

### Functionalities

- Add staff phone number
- View staff phone numbers
- Edit phone number
- Delete phone number

### Composite Primary Key

`StaffID + PhoneNo`

---

# Repayment Management

The Repayment module records repayments made against loans.

### Functionalities

- Add repayment
- View repayments
- Edit repayment
- Delete repayment
- Associate repayments with loans

A loan can have multiple repayments.

The repayment table uses a composite key:

`LoanID + RepaymentNo`

---

# Database Design

The project uses a relational MySQL database named:

`cooperative_db`

The database contains 14 tables.

| No. | Table | Purpose |
|---|---|---|
| 1 | MEMBER | Stores member information |
| 2 | COOPERATIVE_SOCIETY | Stores cooperative society information |
| 3 | VILLAGE_AREA | Stores village/area information |
| 4 | STAFF | Stores staff information |
| 5 | FUND | Stores financial fund information |
| 6 | MEMBER_PHONE | Stores member phone numbers |
| 7 | MEMBERSHIP | Connects members and societies |
| 8 | COOPERATIVE_GROUP | Stores cooperative groups |
| 9 | MEMBER_GROUP | Connects members and groups |
| 10 | SAVINGS_ACCOUNT | Stores savings accounts |
| 11 | LOAN | Stores member loan information |
| 12 | LOAN_FUND | Connects loans and funds |
| 13 | STAFF_PHONE | Stores staff phone numbers |
| 14 | REPAYMENT | Stores loan repayment information |

---

# Database Relationships

The database uses primary-key and foreign-key relationships to maintain referential integrity.

### Major relationships

- MEMBER → MEMBER_PHONE
- MEMBER ↔ COOPERATIVE_SOCIETY through MEMBERSHIP
- COOPERATIVE_SOCIETY → COOPERATIVE_GROUP
- VILLAGE_AREA → COOPERATIVE_GROUP
- MEMBER ↔ COOPERATIVE_GROUP through MEMBER_GROUP
- MEMBER → SAVINGS_ACCOUNT
- MEMBER → LOAN
- MEMBER → SAVINGS_ACCOUNT as nominee
- LOAN ↔ FUND through LOAN_FUND
- LOAN → REPAYMENT
- STAFF → STAFF_PHONE

---

# Keys and Constraints

The database uses:

### Primary Keys

Primary keys uniquely identify records in each table.

Examples:

- MemberID
- SocietyID
- StaffID
- FundID
- GroupID
- AccountNo
- LoanID

### Composite Primary Keys

Composite keys are used where relationships require more than one attribute.

Examples:

- `(MemberID, PhoneNo)`
- `(MemberID, SocietyID)`
- `(MemberID, GroupID)`
- `(LoanID, FundID)`
- `(StaffID, PhoneNo)`
- `(LoanID, RepaymentNo)`

### Foreign Keys

Foreign keys connect related tables and maintain referential integrity.

For example:

`LOAN.MemberID → MEMBER.MemberID`

---

# Frontend

The frontend is built using:

- React
- Vite
- JavaScript
- HTML
- CSS

The frontend provides a tab-based management interface.

Each database entity has its own management interface where users can perform CRUD operations.

---

# Backend

The backend is built using:

- Java
- Spring Boot
- Maven
- JDBC

The backend exposes REST API endpoints for communication between the frontend and MySQL database.

The backend follows a layered structure containing:

- Models
- DAOs
- Controllers

JDBC is used for direct database interaction.

---

# System Architecture

The application follows this architecture:

```text
┌───────────────────────────────┐
│          React Frontend       │
│        HTML + CSS + JS        │
└───────────────┬───────────────┘
                │
                │ REST API / HTTP
                ▼
┌───────────────────────────────┐
│       Spring Boot Backend     │
│             Java              │
│                               │
│ Controllers → DAOs → JDBC     │
└───────────────┬───────────────┘
                │
                │ JDBC
                ▼
┌───────────────────────────────┐
│          MySQL Database       │
│        cooperative_db         │
└───────────────────────────────┘
