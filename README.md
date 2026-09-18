# Microfinance and Cooperative Society Management System

A comprehensive, full-stack relational database management system (DBMS) designed to digitize and streamline the core operations of a microfinance and cooperative society. It provides a robust, text-based academic interface for efficiently managing members, cooperative societies, funds, loan distributions, and savings accounts. The application acts as a web-based interface allowing users to perform operations that are directly reflected in the MySQL database.

## Team Members

| Role | Team Member | Registration Number |
|------|-------------|---------------------|
| Frontend Development | Karthikeyan Saravana | 25BCE1675 |
| Backend Development | Hitesh J Shenoy | 25BCE1603 |
| Backend and Frontend Connection & Database | Akshita Agrawal | 25BCE1589 |

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Key Features](#5-key-features)
6. [Dashboard](#6-dashboard)
7. [Functional Modules](#7-functional-modules)
8. [Database Design](#8-database-design)
9. [Database Tables](#9-database-tables)
10. [Relationships and Constraints](#10-relationships-and-constraints)
11. [CRUD Operations](#11-crud-operations)
12. [API Documentation](#12-api-documentation)
13. [Frontend](#13-frontend)
14. [Backend](#14-backend)
15. [Frontend–Backend–Database Connection](#15-frontendbackenddatabase-connection)
16. [Project Structure](#16-project-structure)
17. [Prerequisites](#17-prerequisites)
18. [Installation and Setup](#18-installation-and-setup)
19. [Database Setup](#19-database-setup)
20. [Environment Variables and Password Configuration](#20-environment-variables-and-password-configuration)
21. [Backend Setup](#21-backend-setup)
22. [Frontend Setup](#22-frontend-setup)
23. [How to Run the Complete Website](#23-how-to-run-the-complete-website)
24. [Application Workflow](#24-application-workflow)
25. [Validation and Data Integrity](#25-validation-and-data-integrity)
26. [Security](#26-security)
27. [Testing](#27-testing)
28. [Error Handling](#28-error-handling)
29. [Future Enhancements](#29-future-enhancements)
30. [Academic Purpose](#30-academic-purpose)
31. [License](#31-license)

## 1. Project Overview
This project solves the problem of manual data entry and disjointed record-keeping in a cooperative society. It systematically manages interrelated entities such as members, cooperative groups, funds, loans, and repayments. The React frontend captures user inputs, passes them to a Java Spring Boot REST API, which executes pure JDBC statements against a highly normalized MySQL database.

## 2. Objectives
- Digitize cooperative society operations.
- Demonstrate complex database relationships (One-to-Many, Many-to-Many, Weak Entities) using standard normal forms.
- Maintain strict referential integrity natively using MySQL constraints.
- Connect a modern React UI to a Java backend without using heavyweight ORMs.

## 3. System Architecture
```text
React Frontend (Vite, Port 5173)
       ↓ (HTTP REST API via JSON)
Spring Boot Backend (Java, Port 8081)
       ↓ (Pure JDBC)
MySQL Database (Port 3306)
```

## 4. Technology Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Java 17, Spring Boot, Maven, JDBC
- **Database**: MySQL

## 5. Key Features
- Centralized read-only Dashboard for a system-wide statistical overview.
- 14 distinct management modules for handling all database entities.
- Clean, responsive, text-only user interface ensuring academic purity.
- Deep relational mapping handling composite primary keys and foreign key dropdowns.
- Graceful error handling and data loading states natively mapped to API responses.

## 6. Dashboard
The centralized dashboard dynamically queries aggregate database statistics. It displays 9 informative metric cards: Total Members, Societies, Village Areas, Staff Members, Funds, Cooperative Groups, Savings Accounts, Total Loans, and Total Repayments. It also includes a "Quick Actions" panel allowing immediate navigation to common add forms. It avoids fabricated data or unrelated charts, ensuring every number reflects actual database state.

## 7. Functional Modules
The application allows users to Add, View, Edit, and Delete records across 14 modules.
1. **Member Management**: Create, update, and manage core member profiles.
2. **Cooperative Society Management**: Register and manage cooperative societies.
3. **Village Area Management**: Map operating regions to postal codes.
4. **Staff Management**: Add and manage society staff members and their designations.
5. **Fund Management**: Track and manage available financial fund categories.
6. **Member Phone Management**: Handle multiple contact numbers for each member using composite keys.
7. **Membership Management**: Map members to societies (many-to-many relationship management).
8. **Cooperative Group Management**: Manage groups operating under specific societies.
9. **Member Group Management**: Manage roles assumed by members within groups.
10. **Savings Account Management**: Handle member savings deposits and assign nominees.
11. **Loan Management**: Manage the issuance of various loans to members.
12. **Loan Fund Management**: Map which funds are used to finance which loans.
13. **Staff Phone Management**: Handle multiple contact numbers for staff.
14. **Repayment Management**: Record installment payments mapped as weak entities dependent on loans.

## 8. Database Design
The `cooperative_db` database is highly normalized to eliminate redundancy. It correctly separates core entities from multi-valued attributes and models complex many-to-many associations via junction tables. 

## 9. Database Tables
The precise tables and their primary fields are:
- `MEMBER` (MemberID, Name, DateOfBirth, HouseNo, Street, City, State, PIN)
- `COOPERATIVE_SOCIETY` (SocietyID, SocietyName, RegistrationDate, Street, City, State, PIN)
- `VILLAGE_AREA` (VillageArea, PIN)
- `STAFF` (StaffID, Name, Designation, Street, City, State, PIN)
- `FUND` (FundID, FundType, TotalAmount)
- `MEMBER_PHONE` (MemberID, PhoneNo)
- `MEMBERSHIP` (MemberID, SocietyID, JoinDate)
- `COOPERATIVE_GROUP` (GroupID, SocietyID, GroupName, ForwardDate, VillageArea, City, State)
- `MEMBER_GROUP` (MemberID, GroupID, Role)
- `SAVINGS_ACCOUNT` (AccountNo, MemberID, OpeningDate, AccountType, NomineeID)
- `LOAN` (LoanID, MemberID, LoanType, Amount, StartDate, Tenure)
- `LOAN_FUND` (LoanID, FundID)
- `STAFF_PHONE` (StaffID, PhoneNo)
- `REPAYMENT` (LoanID, RepaymentNo, PaymentDate, AmountPaid, ModeOfPayment)

## 10. Relationships and Constraints
- **Member ↔ Cooperative Society** (Many-to-Many through `MEMBERSHIP`)
- **Member ↔ Cooperative Group** (Many-to-Many through `MEMBER_GROUP`)
- **Loan ↔ Fund** (Many-to-Many through `LOAN_FUND`)
- **Society → Cooperative Groups** (One-to-Many via `SocietyID` FK)
- **Village Area → Cooperative Groups** (One-to-Many via `VillageArea` FK)
- **Member → Member Phone** (One-to-Many via `MemberID` FK)
- **Staff → Staff Phone** (One-to-Many via `StaffID` FK)
- **Member → Savings Account** (One-to-Many via `MemberID` FK)
- **Member → Loan** (One-to-Many via `MemberID` FK)
- **Loan → Repayment** (One-to-Many Weak Entity via `LoanID` FK)

## 11. CRUD Operations
- **Create**: Clicking "Add [Entity]" expands a form containing required database fields (and dropdowns for foreign keys). Submission triggers a POST request.
- **Read**: Records are loaded asynchronously via GET requests and displayed in clean `.data-table` tables.
- **Update**: Clicking `[Edit]` populates the form for PUT requests. Primary keys become disabled to prevent accidental modification.
- **Delete**: Clicking `[Delete]` opens a custom React modal requesting confirmation before executing a DELETE request.
- **Refresh**: Handled without browser reloads. Tapping "Refresh" updates a `loading` state, triggers the `GET` API, updates the UI, and displays a "Last refreshed: [time]" indicator.

## 12. API Documentation
Standardized REST endpoints are exposed by the Java backend:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/dashboard/summary` | Fetch aggregated counts for the dashboard |
| GET | `/api/members` | Fetch all members |
| POST | `/api/members` | Create a new member |
| PUT | `/api/members/{memberId}` | Update a specific member |
| DELETE | `/api/members/{memberId}` | Delete a specific member |
| GET | `/api/memberships` | Fetch all society memberships |
| PUT | `/api/memberships/{memberId}/{societyId}` | Update composite-key membership record |

*(This REST structure is symmetrically applied across all 14 entities: `/api/societies`, `/api/village-areas`, `/api/staff`, `/api/funds`, `/api/loans`, `/api/repayments`, etc.)*

## 13. Frontend
Built completely in React and served via Vite, the frontend uses an `App.jsx` layout router that controls the centralized sidebar and primary view. It maintains 14 distinct functional components (e.g. `MemberManagement.jsx`), each utilizing React Hooks (`useState`, `useEffect`) to handle state, forms, and validation. API calls are neatly abstracted into a shared `src/services/api.js` layer.

## 14. Backend
The backend utilizes Java Spring Boot and Maven. It is strictly architected into Controllers, DAOs, and Models. Unlike modern auto-magic frameworks, it deliberately avoids JPA/Hibernate. Database connections and querying are executed purely using Java Database Connectivity (JDBC) `PreparedStatement` interfaces to guarantee explicit query execution.

## 15. Frontend–Backend–Database Connection
When a user submits a form on the React UI, the data is packaged into JSON and dispatched via HTTP (`fetch` in `api.js`). The Spring Boot Controller (`@RestController`) receives this JSON, maps it to a Java Model, and passes it to the Data Access Object (DAO). The DAO prepares a native SQL statement (e.g., `INSERT INTO MEMBER...`), connects to MySQL via JDBC, and executes the statement. The success or failure code cascades back up the chain, dynamically updating the React UI state.

## 16. Project Structure
```text
cooperative/
├── backend/
│   ├── src/main/java/com/cooperative/
│   │   ├── controller/      # REST API Endpoints
│   │   ├── dao/             # Pure JDBC Data Access Objects
│   │   └── model/           # Java POJO mappings
│   ├── src/main/resources/
│   │   └── application.properties # Database configuration
│   └── pom.xml              # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React Management & Dashboard components
│   │   ├── services/
│   │   │   └── api.js       # Centralized API fetch logic
│   │   ├── App.jsx          # Sidebar routing and layout
│   │   └── App.css          # Global styling
│   ├── package.json         # NPM dependencies
│   └── index.html           # Vite entrypoint
├── database/
│   └── cooperative_db.sql   # Complete database schema and seed data
├── .gitignore
└── README.md
```

## 17. Prerequisites
Before running the system, ensure the following are installed locally:
- **Java Development Kit (JDK 17 or higher)** (`java -version`)
- **Maven** (`mvn -version`)
- **Node.js & npm** (`node -v` and `npm -v`)
- **MySQL Server** (`mysql -V`)

## 18. Installation and Setup
Clone or download this GitHub repository to your local Windows environment (e.g., `D:\cooperative`). 

## 19. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Execute the included `database/cooperative_db.sql` file. 
3. This script uses `CREATE DATABASE IF NOT EXISTS cooperative_db;` and will safely generate the database, all 14 tables, and sample data.

## 20. Environment Variables and Password Configuration
The backend strictly relies on environment variables for database authentication. Do **not** hardcode your passwords into `application.properties` before committing to GitHub. 

| Variable | Purpose | Example |
|----------|---------|---------|
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `YOUR_MYSQL_PASSWORD` |

Set these variables in your active PowerShell window before launching the backend.

## 21. Backend Setup
Open a PowerShell window, navigate to the backend folder, set your credentials, and start Spring Boot:
```powershell
cd D:\cooperative\backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
mvn spring-boot:run
```
A successful start will output `Started CooperativeApplication` and the server will listen on port `8081`.

## 22. Frontend Setup
Open a **new** PowerShell window, navigate to the frontend folder, install dependencies, and start Vite:
```powershell
cd D:\cooperative\frontend
npm.cmd install
npm.cmd run dev
```
The server will start and typically listen on port `5173`. Both frontend and backend must be running simultaneously for the application to function.

## 23. How to Run the Complete Website
**STEP 1** — Install all prerequisites (Java, Maven, Node.js, MySQL).  
**STEP 2** — Download the repository to your machine.  
**STEP 3** — Run `cooperative_db.sql` in MySQL to set up the database.  
**STEP 4** — Open PowerShell and configure `$env:DB_PASSWORD`.  
**STEP 5** — Run `mvn spring-boot:run` in the `backend` folder.  
**STEP 6** — Open a second PowerShell, run `npm.cmd install` and `npm.cmd run dev` in the `frontend` folder.  
**STEP 7** — Open your browser to `http://localhost:5173`.  
**STEP 8** — Test the Dashboard metrics.  
**STEP 9** — Use the sidebar to navigate and manage database records.  

## 24. Application Workflow
Upon accessing `http://localhost:5173`, you arrive at the Dashboard (which triggers `GET /api/dashboard/summary`). Navigating to "Members" mounts the `MemberManagement` component, triggering `fetchMembers()`. Users can edit fields, press "Update", and wait for the successful HTTP PUT request to resolve, which immediately re-fetches the table data to reflect the changes.

## 25. Validation and Data Integrity
- **Database level**: Implements `NOT NULL`, `CHECK` constraints (e.g. `Amount > 0`), and `PRIMARY KEY` uniqueness. 
- **Relationships**: Protected by specific foreign-key logic like `ON DELETE CASCADE` (deleting a member deletes their phone numbers) and `ON DELETE RESTRICT` (preventing deletion of a member if they hold an active loan).
- **Frontend level**: Forms enforce basic HTML5 `required` properties and `maxLength` constraints matching the SQL schema.

## 26. Security
- Credentials are secured via environment variables instead of hardcoded strings in source code. 
- Due to the academic scope of this DBMS project, complex JWT authentication, HTTPS encryption, or role-based access controls (RBAC) are not implemented.

## 27. Testing
The application underwent systematic manual testing across all 14 endpoints:
- Successfully added, viewed, edited, and deleted records for all primary and composite entities.
- Verified foreign-key dropdown bindings correctly retrieve valid references.
- Verified browser persistence and real-time dashboard statistic aggregation.
- Verified successful rejection of records violating database constraints (e.g. invalid foreign keys or null primary keys).

## 28. Error Handling
The React application gracefully handles rejected network requests. If a database constraint is violated or the backend goes offline, the `catch` block intercepts the failure and displays plain text alerts (`Unable to load records.` or `Failed to save member`). The Spring Boot backend uses a `@RestControllerAdvice` global exception handler to neatly format SQL Exceptions into standard JSON error responses.

## 29. Future Enhancements
- **FUTURE**: Implementation of login authentication and Role-Based Access Control (RBAC).
- **FUTURE**: Pagination and advanced search/filtering for large record sets.
- **FUTURE**: Data export features (e.g., CSV/PDF reports).
- **FUTURE**: Deployment to a cloud environment (e.g., AWS/Heroku/Vercel).

## 30. Academic Purpose
This project is a pristine demonstration of core relational database management concepts. It proves practical understanding of Entity-Relationship modeling, normalization, composite keys, referential integrity mapping, and the implementation of complete DDL/DML cycles via JDBC and a modern web frontend.

## 31. License
This project is intended exclusively for educational and academic purposes.
